import {useEffect, useState, FormEvent} from 'react'

import styles from './home.module.css'

import { Link, useNavigate} from 'react-router-dom'

import { BiSearchAlt } from "react-icons/bi"

interface CoinProps{
  name: string;
  delta_24h: string;
  price: string;
  symbol: string;
  volume_24h: string;
  market_cap: string;
  formattedPrice: string;
  formattedMarket: string;
  formattedDelta: number;
}

interface DataProps{
  coins: CoinProps[];
}

export function Home(){

  const[coins, setCoins] = useState<CoinProps[]>([])
  const[inputValue, setInputValue] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    function getData(){
      fetch('https://sujeitoprogramador.com/api-cripto/?key=1401dc1cf9c04be9&pref=BRL')
      .then(response => response.json())
      .then((data: DataProps) => {
        const coinsData = data.coins.slice(0, 15);

        const price = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency:"BRL"
        })

        const formatResult = coinsData.map((item) => {
          const formatted = {
            ...item,
            formattedPrice: price.format(Number(item.price)),
            formattedMarket: price.format(Number(item.market_cap)),
            formattedDelta: parseFloat(item.delta_24h.replace(",", ".")),
          }

          return formatted;
        })
        setCoins(formatResult);
      })
    }

    getData();

  }, [])

  function handleSearch(e: FormEvent){
    e.preventDefault();
    if(inputValue == "") return;

    navigate(`/detail/${inputValue}`)
  }

  return(
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSearch}>
        <input
        placeholder="Digite o símbolo da moeda"
        value={inputValue}
        onChange={ (e) => setInputValue(e.target.value)}
        />
        <button type="submit">
          <BiSearchAlt size={30} color="#fff"/>
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
          </tr>
        </thead>

        <tbody id="tbody">
          {coins.map( coin => (          
            <tr key={coin.name} className={styles.tr}>
              <td className={styles.td} data-label="Moeda">
                <Link className={styles.link} to={`/detail/${coin.symbol}`}>
                  <span>{coin.name}</span> | {coin.symbol}
                </Link>
              </td>
              <td className={styles.td} data-label="Mercado">
                {coin.formattedMarket}
              </td>
              <td className={styles.td} data-label="Preço">
                {coin.formattedPrice}
              </td>
              <td className={coin.formattedDelta >= 0 ? styles.tdProfit : styles.tdLoss} data-label="Volume">
                <span>{coin.formattedDelta}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
