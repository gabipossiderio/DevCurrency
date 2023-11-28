import { useEffect, useState } from'react'
import styles from './detail.module.css'
import { useParams, useNavigate } from 'react-router-dom'

interface CoinProp{
  symbol: string;
  name: string;
  price: string;
  market_cap: string;
  low_24h: string;
  high_24h: string;
  total_volume_24h: string;
  delta_24h: string;
  formattedPrice: string;
  formattedLowPrice: string;
  formattedHighPrice: string;
  formattedMarket: string;
  formattedDelta: number;
}

export function Detail(){
  const {crypto} = useParams();
  const [detail, setDetail] = useState<CoinProp>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    function getData(){
      fetch(`https://sujeitoprogramador.com/api-cripto/coin/?key=1401dc1cf9c04be9&symbol=${crypto}`)
      .then(response => response.json())
      .then((data: CoinProp) => {

        if(Number(data.price) <= 0) throw new Error("Error getting currency value")

        const price = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency:"BRL"
        })

        const resultData = {
          ...data,
          formattedPrice: price.format(Number(data.price)),
          formattedMarket: price.format(Number(data.market_cap)),
          formattedLowPrice: price.format(Number(data.low_24h)),
          formattedHighPrice: price.format(Number(data.high_24h)),
          formattedDelta: parseFloat(data.delta_24h.replace(",", ".")),
        }

        setDetail(resultData);
        setLoading(false);

      })
      
      .catch(error => {
        console.log(error);
        navigate(`/not-found`)
      })
    }

    getData();
  }, [crypto, navigate])

  if(loading){
    return(
      <div className={styles.container}>
        <h4 className={styles.loading}>Carregando...</h4>
      </div>
    )
  }

  return(
    <div className={styles.container}>
      <h4 className={styles.center}>{detail?.name}</h4>
      <p className={styles.center}>{detail?.symbol}</p>

      <section className={styles.content}>
        <p>
          <strong>Preço:</strong> {detail?.formattedPrice}
        </p>
        <p>
          <strong>Maior preço em 24h:</strong> {detail?.formattedHighPrice}
        </p>
        <p>
          <strong>Menor preço em 24h:</strong> {detail?.formattedLowPrice}
        </p>
        <p>
          <strong>Delta 24h:</strong>
          <span className={detail?.formattedDelta && detail.formattedDelta >= 0 ? styles.profit : styles.loss}>
                {detail?.formattedDelta}
          </span>
        </p>
        <p>
          <strong>Valor de Mercado:</strong> {detail?.formattedMarket}
        </p>
      </section>
    </div>
  )
}
