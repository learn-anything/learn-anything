/** @jsx jsx */
import { jsx } from 'theme-ui'
import { rgba } from 'polished'
import React from 'react'
import { Search } from 'react-feather'

function SearchInput({ placeholder, value, onChange, ...props }) {
  const inputElement = React.useRef(null)

  function handleKeyDown(event) {
    if (event.key === '/' && inputElement.current !== document.activeElement) {
      event.preventDefault()
      inputElement.current.focus()
    }
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div sx={{ position: 'relative' }} {...props}>
        <div
            sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '0.75rem',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Search color="#adb5bd" />
        </div>
        <input
            ref={inputElement}
            type="search"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            sx={{
                width: '100%',
                margin: 0,
                padding: '0.75rem',
                paddingLeft: '3.25rem',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                color: 'inherit',
                background: `${rgba('#C4C4C4', 0.22)}`,
                boxShadow: 'none', // '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: 0,
                appearance: 'none',
                outline: 0,
                borderRadius: '4px',
                // Removes the extra left padding added to search inputs on Safari
                '::-webkit-search-decoration': {
                    display: 'none',
                },
                '&:focus': {
                    boxShadow: `0 0 0 3px ${rgba('#0066ff', 0.5)}`,
                },
            }}
        />
    </div>
  )
}

export default SearchInput
