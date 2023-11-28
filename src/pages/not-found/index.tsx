import styles from './not-found.module.css'

import { Link } from 'react-router-dom'

export function NotFound(){
  return(
    <div className={styles.container}>
      <h1>Page not found</h1>
      <Link to="/">
        Voltar à página inicial
      </Link>
    </div>
  )
}