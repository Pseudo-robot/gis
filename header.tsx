import Link from 'next/link'
import ExtLink from './ext-link'
import styles from '@/styles/header.module.css'

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'Home', page: '/sigap' },
  { label: 'Tentang', page: '/sigap//tentang' },
  { label: 'Manfaat', page: '/sigap/manfaat' },
]

const Header = ({ titlePre = '' }) => {
  // const { pathname } = useRouter()

  return (
    <header className={styles.header}>
      <ul>
        {navItems.map(({ label, page, link }) => (
          <li key={label}>
            {page ? (
              <Link href={page} className='font-bold'>
                {/* <a className={pathname === page ? 'active' : undefined}> */}
                  {label}
                {/* </a> */}
              </Link>
            ) : (
              <ExtLink href={link}>{label}</ExtLink>
            )}
          </li>
        ))}
      </ul>
    </header>
  )
}

export default Header
