// Solana Transaction Service for automatic trade tracking
// Using pure fetch instead of @solana/web3.js for better control

interface TokenSwap {
  signature: string
  timestamp: number
  tokenIn: string // Mint address of token being sold
  tokenOut: string // Mint address of token being bought
  amountIn: number
  amountOut: number
  tokenInSymbol?: string
  tokenOutSymbol?: string
  price: number // Price of tokenOut in tokenIn (e.g., SOL price)
  priceInUsd?: number
  marketCap?: number
}

interface TokenInfo {
  symbol: string
  name: string
  price: number
  marketCap: number
}

interface ParsedTransactionWithMeta {
  transaction: any
  meta: any
  blockTime: number
}

// Helius API key
const HELIUS_API_KEY = '4010dbf3-d6c9-4086-86ca-e3cabe570c53'
const HELIUS_RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`

// Helper for RPC calls
const rpcCall = async (method: string, params: any[]): Promise<any> => {
  const response = await fetch(HELIUS_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }),
  })
  
  const data = await response.json()
  if (data.error) {
    throw new Error(data.error.message)
  }
  return data.result
}

// Get transaction history for a wallet using pure fetch
export const getWalletTransactions = async (
  walletAddress: string,
  limit: number = 50
): Promise<ParsedTransactionWithMeta[]> => {
  try {
    // Get signatures
    const signatures = await rpcCall('getSignaturesForAddress', [
      walletAddress,
      { limit, commitment: 'confirmed' },
    ])
    
    if (!signatures || signatures.length === 0) {
      return []
    }
    
    // Get transactions using getTransaction (not getParsedTransaction)
    const transactions: ParsedTransactionWithMeta[] = []
    
    for (const sig of signatures) {
      try {
        const tx = await rpcCall('getTransaction', [
          sig.signature,
          { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0, commitment: 'confirmed' },
        ])
        
        if (tx) {
          transactions.push({
            transaction: tx.transaction,
            meta: tx.meta,
            blockTime: sig.blockTime,
          })
        }
      } catch (e) {
        console.error('Error parsing transaction:', sig.signature, e)
      }
    }
    
    return transactions
  } catch (error) {
    console.error('Error fetching wallet transactions:', error)
    return []
  }
}

// Parse transaction to find DEX swaps and token operations
export const parseSwapsFromTransaction = (tx: ParsedTransactionWithMeta | null): TokenSwap[] => {
  const swaps: TokenSwap[] = []
  
  if (!tx || !tx.meta || !tx.transaction) return swaps

  const transaction = tx.transaction
  const timestamp = tx.blockTime ? tx.blockTime * 1000 : Date.now()
  
  // Check for parsed instructions - handle both legacy and versioned transactions
  const message = transaction.message as any
  let instructions: any[] = []

  if (message && message.instructions) {
    instructions = Array.isArray(message.instructions) ? message.instructions : []
  }

  // Also check for inner instructions in token balances
  if (tx.meta?.innerInstructions && Array.isArray(tx.meta.innerInstructions)) {
    for (const inner of tx.meta.innerInstructions) {
      if (inner && inner.instructions && Array.isArray(inner.instructions)) {
        instructions.push(...inner.instructions)
      }
    }
  }

  for (const instruction of instructions) {
    try {
      // Jupiter swap - check multiple patterns
      if (isJupiterSwap(instruction)) {
        const swap = parseJupiterSwap(instruction, timestamp, transaction.signatures?.[0] || '')
        if (swap) swaps.push(swap)
      }
      // Orca swap
      else if (isOrcaSwap(instruction)) {
        const swap = parseOrcaSwap(instruction, timestamp, transaction.signatures?.[0] || '')
        if (swap) swaps.push(swap)
      }
      // Raydium swap
      else if (isRaydiumSwap(instruction)) {
        const swap = parseRaydiumSwap(instruction, timestamp, transaction.signatures?.[0] || '')
        if (swap) swaps.push(swap)
      }
      // SPL Token transfers and other operations
      else if (isSplTokenInstruction(instruction)) {
        const swap = parseSplTokenInstruction(instruction, timestamp, transaction.signatures?.[0] || '')
        if (swap) swaps.push(swap)
      }
    } catch (e) {
      console.error('Error parsing instruction:', e)
    }
  }

  // Always try to detect from token balance changes as fallback
  // This catches swaps that weren't parsed from instructions
  if (tx.meta?.postTokenBalances && tx.meta?.preTokenBalances) {
    const tokenSwaps = parseSwapsFromTokenBalances(tx, timestamp)
    // Add swaps that aren't duplicates (by signature + token)
    for (const ts of tokenSwaps) {
      const exists = swaps.some(s => 
        s.signature === ts.signature && s.tokenOut === ts.tokenOut
      )
      if (!exists) {
        swaps.push(ts)
      }
    }
  }

  return swaps
}

// Check if instruction is SPL Token instruction
const isSplTokenInstruction = (instruction: any): boolean => {
  return instruction?.program === 'spl-token' ||
         instruction?.programId?.toString() === 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
}

// Parse SPL Token instruction (transfer, mint, burn, etc.)
const parseSplTokenInstruction = (instruction: any, timestamp: number, signature: string): TokenSwap | null => {
  try {
    const data = instruction?.parsed
    
    if (!data) return null
    
    const type = data?.type
    const info = data?.info || {}
    
    // Transfer - token going out (sell)
    if (type === 'transfer' || type === 'transferChecked') {
      const amount = parseFloat(info.amount || info.tokenAmount?.amount || 0) / 1e9
      const mint = info.mint
      if (mint && amount > 0) {
        return {
          signature,
          timestamp,
          tokenIn: 'So11111111111111111111111111111111111111112', // SOL
          tokenOut: mint,
          amountIn: 0.001, // Approximate SOL value
          amountOut: amount,
          price: 0, // Will be enriched later
        }
      }
    }
    
    // MintTo - receiving new tokens (buy)
    if (type === 'mintTo' || type === 'mintToChecked') {
      const amount = parseFloat(info.amount || info.tokenAmount?.amount || 0) / 1e9
      const mint = info.mint
      if (mint && amount > 0) {
        return {
          signature,
          timestamp,
          tokenIn: 'So11111111111111111111111111111111111111112', // SOL
          tokenOut: mint,
          amountIn: 0.001,
          amountOut: amount,
          price: 0,
        }
      }
    }
    
    return null
  } catch (e) {
    return null
  }
}

// Parse swaps from token balance changes (fallback method)
// Only detects actual swaps (not closeAccount operations)
const parseSwapsFromTokenBalances = (tx: ParsedTransactionWithMeta, timestamp: number): TokenSwap[] => {
  const swaps: TokenSwap[] = []
  const signature = tx.transaction.signatures?.[0] || ''
  
  const preBalances = tx.meta?.preTokenBalances || []
  const postBalances = tx.meta?.postTokenBalances || []
  
  // Skip if only closing accounts (pre has balance, post has none for same mint)
  // This is closeAccount, not a swap
  const hasOnlyClosings = postBalances.length === 0 && preBalances.length > 0
  if (hasOnlyClosings) {
    return swaps
  }
  
  // Look for balance changes to detect swaps
  const preByOwner: Record<string, any[]> = {}
  const postByOwner: Record<string, any[]> = {}
  
  for (const bal of preBalances as any[]) {
    if (!preByOwner[bal.owner]) preByOwner[bal.owner] = []
    preByOwner[bal.owner].push(bal)
  }
  
  for (const bal of postBalances as any[]) {
    if (!postByOwner[bal.owner]) postByOwner[bal.owner] = []
    postByOwner[bal.owner].push(bal)
  }
  
  // Check if this wallet had any token changes
  const ownerMints = new Set([...Object.keys(preByOwner), ...Object.keys(postByOwner)])
  
  for (const owner of ownerMints) {
    const preBal = preByOwner[owner] || []
    const postBal = postByOwner[owner] || []
    
    for (const post of postBal) {
      const pre = preBal.find((p: any) => p.mint === post.mint)
      const preAmount = pre?.uiTokenAmount?.uiAmount || 0
      const postAmount = post?.uiTokenAmount?.uiAmount || 0
      
      // Skip SOL (native)
      if (post.mint === 'So11111111111111111111111111111111111111112') continue
      
      // Skip if no change
      if (postAmount === preAmount) continue
      
      // If balance increased - BUY (swap SOL -> Token)
      if (postAmount > preAmount && postAmount > 0) {
        swaps.push({
          signature,
          timestamp,
          tokenIn: 'So11111111111111111111111111111111111111112', // SOL
          tokenOut: post.mint,
          amountIn: 0.001, // Approximate - will be enriched
          amountOut: postAmount - preAmount,
          price: 0,
        })
      }
      // If balance decreased - SELL (swap Token -> SOL)
      else if (postAmount < preAmount && preAmount > 0) {
        swaps.push({
          signature,
          timestamp,
          tokenIn: post.mint,
          tokenOut: 'So11111111111111111111111111111111111111112', // SOL
          amountIn: preAmount - postAmount,
          amountOut: 0.001, // Approximate - will be enriched
          price: 0,
        })
      }
    }
  }
  
  return swaps
}

// Check if instruction is Jupiter swap
const isJupiterSwap = (instruction: any): boolean => {
  return instruction?.program === 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV' ||
         instruction?.programId?.toString() === 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV'
}

// Parse Jupiter swap
const parseJupiterSwap = (instruction: any, timestamp: number, signature: string): TokenSwap | null => {
  try {
    const data = instruction?.parsed || instruction?.data
    
    // Jupiter V6 swap
    if (data?.type === 'route') {
      const route = data.route || data
      const inputAmount = route?.inAmount || route?.inputAmount
      const outputAmount = route?.outAmount || route?.outputAmount
      const inputMint = route?.inputMint
      const outputMint = route?.outputMint
      
      if (inputAmount && outputAmount && inputMint && outputMint) {
        const price = parseFloat(outputAmount) / parseFloat(inputAmount)
        
        return {
          signature,
          timestamp,
          tokenIn: inputMint,
          tokenOut: outputMint,
          amountIn: parseFloat(inputAmount) / 1e9, // Assuming SOL
          amountOut: parseFloat(outputAmount) / 1e9,
          price,
        }
      }
    }
    
    return null
  } catch (e) {
    return null
  }
}

// Check if instruction is Orca swap
const isOrcaSwap = (instruction: any): boolean => {
  return instruction?.program === 'swaps' ||
         instruction?.programId?.toString()?.includes('swap')
}

// Parse Orca swap
const parseOrcaSwap = (instruction: any, timestamp: number, signature: string): TokenSwap | null => {
  try {
    const data = instruction?.parsed
    
    if (data?.type === 'swap') {
      const inputAmount = data?.amountIn
      const outputAmount = data?.amountOut
      const inputMint = data?.tokenA
      const outputMint = data?.tokenB
      
      if (inputAmount && outputAmount && inputMint && outputMint) {
        const price = parseFloat(outputAmount) / parseFloat(inputAmount)
        
        return {
          signature,
          timestamp,
          tokenIn: inputMint,
          tokenOut: outputMint,
          amountIn: parseFloat(inputAmount) / 1e9,
          amountOut: parseFloat(outputAmount) / 1e9,
          price,
        }
      }
    }
    
    return null
  } catch (e) {
    return null
  }
}

// Check if instruction is Raydium swap
const isRaydiumSwap = (instruction: any): boolean => {
  return instruction?.program === 'raydium' ||
         instruction?.programId?.toString()?.includes('raydium')
}

// Parse Raydium swap
const parseRaydiumSwap = (instruction: any, timestamp: number, signature: string): TokenSwap | null => {
  try {
    const data = instruction?.parsed
    
    if (data?.type === 'tokenSwap') {
      const inputAmount = data?.amountIn
      const outputAmount = data?.amountOut
      const inputMint = data?.tokenA
      const outputMint = data?.tokenB
      
      if (inputAmount && outputAmount && inputMint && outputMint) {
        const price = parseFloat(outputAmount) / parseFloat(inputAmount)
        
        return {
          signature,
          timestamp,
          tokenIn: inputMint,
          tokenOut: outputMint,
          amountIn: parseFloat(inputAmount) / 1e9,
          amountOut: parseFloat(outputAmount) / 1e9,
          price,
        }
      }
    }
    
    return null
  } catch (e) {
    return null
  }
}

// Get token info from DEX Screener
export const getTokenInfo = async (tokenAddress: string): Promise<TokenInfo | null> => {
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`)
    const data = await response.json()
    
    if (data?.pairs && data.pairs.length > 0) {
      const pair = data.pairs[0]
      return {
        symbol: pair.baseToken?.symbol || pair.quoteToken?.symbol || '',
        name: pair.baseToken?.name || pair.quoteToken?.name || '',
        price: parseFloat(pair.priceUsd || '0'),
        marketCap: parseFloat(pair.fdv || pair.marketCap || '0'),
      }
    }
    
    return null
  } catch (error) {
    console.error('Error fetching token info:', error)
    return null
  }
}

// Get SOL price in USD
export const getSolPrice = async (): Promise<number> => {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT')
    const data = await response.json()
    return parseFloat(data.price)
  } catch (error) {
    console.error('Error fetching SOL price:', error)
    return 0
  }
}

// Get all swaps for a wallet
export const getWalletSwaps = async (walletAddress: string, limit: number = 100): Promise<TokenSwap[]> => {
  console.log('Fetching transactions for wallet:', walletAddress, 'limit:', limit)
  
  const transactions = await getWalletTransactions(walletAddress, limit)
  console.log('Found transactions:', transactions.length)
  
  const allSwaps: TokenSwap[] = []
  
  for (const tx of transactions) {
    const swaps = parseSwapsFromTransaction(tx)
    if (swaps.length > 0) {
      console.log('Found swaps in transaction:', swaps.length)
    }
    allSwaps.push(...swaps)
  }
  
  console.log('Total swaps found before enrichment:', allSwaps.length)
  
  // Sort by timestamp descending
  allSwaps.sort((a, b) => b.timestamp - a.timestamp)
  
  // Get SOL price
  const solPrice = await getSolPrice()
  console.log('SOL price:', solPrice)
  
  // Enrich swaps with token info (limit to first 10 to avoid rate limiting)
  const swapsToEnrich = allSwaps.slice(0, 10)
  for (const swap of swapsToEnrich) {
    // Get token info for output (the token being bought)
    if (swap.tokenOut) {
      try {
        const tokenInfo = await getTokenInfo(swap.tokenOut)
        if (tokenInfo) {
          swap.tokenOutSymbol = tokenInfo.symbol
          swap.priceInUsd = swap.price * solPrice
          swap.marketCap = tokenInfo.marketCap
          console.log('Token info for', swap.tokenOut, ':', tokenInfo)
        }
      } catch (error) {
        console.error('Error fetching token info for swap:', swap.tokenOut, error)
      }
    }
  }

  return allSwaps
}

// Match swaps into trades (buy + sell)
export const matchSwapsToTrades = (swaps: TokenSwap[]): any[] => {
  const trades: any[] = []
  const openPositions: Map<string, any> = new Map()
  
  for (const swap of swaps) {
    // Skip if no token or no amount
    if (!swap.tokenOut || !swap.amountOut || swap.amountOut <= 0) continue
    
    const tokenMint = swap.tokenOut
    
    if (!openPositions.has(tokenMint)) {
      // New position (buy/mint)
      const price = swap.priceInUsd || swap.price || 0.001
      openPositions.set(tokenMint, {
        entrySignature: swap.signature,
        entryDate: new Date(swap.timestamp).toISOString(),
        tokenSymbol: swap.tokenOutSymbol || 'UNKNOWN',
        tokenContract: swap.tokenOut,
        network: 'solana',
        entryPrice: price,
        entryMarketCap: swap.marketCap,
        entryAmount: swap.amountOut,
        entryValue: swap.amountOut * price,
        status: 'open',
        swaps: [swap],
      })
    } else {
      // Existing position - could be additional buy or sell
      const position = openPositions.get(tokenMint)
      const exitPrice = swap.priceInUsd || swap.price || 0.001
      
      // If this is another buy (amountOut > amountIn), add to position
      if (swap.amountOut > 0 && swap.amountIn === 0.001) {
        const newAmount = position.entryAmount + swap.amountOut
        const newValue = position.entryValue + (swap.amountOut * exitPrice)
        position.entryAmount = newAmount
        position.entryValue = newValue
        position.swaps.push(swap)
      } else {
        // This is a sell - close position
        const exitValue = swap.amountIn * exitPrice
        
        trades.push({
          ...position,
          exitSignature: swap.signature,
          exitDate: new Date(swap.timestamp).toISOString(),
          exitPrice,
          exitAmount: swap.amountIn,
          exitValue,
          exitMarketCap: swap.marketCap,
          status: 'closed',
        })
        openPositions.delete(tokenMint)
      }
    }
  }
  
  // Add remaining open positions
  for (const position of openPositions.values()) {
    trades.push(position)
  }
  
  return trades
}