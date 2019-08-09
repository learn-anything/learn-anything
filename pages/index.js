/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'
import { parse } from 'serialize-query-params'
import { StringParam, useQueryParam } from 'use-query-params'
import SearchInput from '../components/SearchInput'

function IndexPage({ location }) {
    const [query, setQuery] = useQueryParam(
        'query',
        StringParam,
        parse(location),
    )

    return (
        <div
            sx={{
                maxWidth: 1024,
                mx: 'auto',
                p: 3,
            }}
        >
            <title>Learn Anything</title>
            {/* <div
                sx={{
                    position: 'absolute',
                    top: '35%',
                }}
            >
                <Styled.h1>Under construction</Styled.h1>
                <Styled.h2>Our developers are currently working extremely hard to get the newest version of Learn Anything up and running!</Styled.h2>
                <Styled.h2>Stay tuned as we have an amazing product headed your way!</Styled.h2>
                <Styled.h2><Styled.a href="https://blog.learn-anything.org">Blog</Styled.a></Styled.h2>
            </div> */}
            <div
                sx={{
                    // display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // maxWidth: '50%'
                    // height: '33%'
                }}
            >
                <SearchInput
                    placeholder={`Search for a topic (Press "/" to focus)`}
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                />
            </div>
        </div>
    )
}

export default IndexPage