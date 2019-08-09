/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'

function SignInPage() {
    return (
        <div
            sx={{
                maxWidth: 1024,
                mx: 'auto',
                p: 3,
            }}
        >
            <title>Sign In</title>
            <Styled.h2>Email</Styled.h2>
            {/* TODO: Add in input box */}
            <Styled.h2>Password</Styled.h2>
            {/* TODO: Add in input box */}
        </div>
    )
}

export default SignInPage
