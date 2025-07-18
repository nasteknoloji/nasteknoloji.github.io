//const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=try&order=market_cap_desc&per_page=1000000&page=1&sparkline=false';
const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,cardano&order=market_cap_desc&per_page=10&page=1&sparkline=false';
const jsonOutput = document.getElementById('json-output');

async function fetchCryptoData() {
    try {
        const response = await fetch(apiUrl);
        const marketData = await response.json();
        
        // Her coin için detaylı verileri çek
        const detailedData = [];
        for (const coin of marketData) {
            const coinResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}`);
            const coinDetails = await coinResponse.json();
            
            detailedData.push({
                name: coin.name,
                symbol: coin.symbol.toUpperCase(),
                price_usd: coin.current_price,
                market_cap_usd: coin.market_cap,
                price_change_24h: coin.price_change_percentage_24h,
                previous_close: coin.current_price, // Yaklaşık değer, API'de tam önceki kapanış yok
                all_time_high: coinDetails.market_data.ath.usd,
                all_time_low: coinDetails.market_data.atl.usd
            });
        }
        
        // JSON'ı formatlı şekilde göster
        jsonOutput.textContent = JSON.stringify(detailedData, null, 2);
    } catch (error) {
        console.error('Error fetching data:', error);
        jsonOutput.textContent = JSON.stringify({ error: 'Failed to load data' }, null, 2);
    }
}

// İlk yüklemede verileri çek
fetchCryptoData();

// Her 30 saniyede bir yenile
setInterval(fetchCryptoData, 30000);
