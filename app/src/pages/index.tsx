import { useAuth } from "../lib/auth"
import Layout from "../components/Layout"
import AddLinkModal from "../components/AddLinkModal"
import { Flex, Heading, Icon, Stack, Button } from "@chakra-ui/core"

const Home = () => {
  const auth = useAuth()

  return (
    <>
      {auth.user ? (
        <Layout>
          <Flex justifyContent="space-between">
            <Heading mb={8}>{}</Heading>
            <AddLinkModal />
          </Flex>
        </Layout>
      ) : (
        <Flex
          as="main"
          direction="column"
          align="center"
          justify="center"
          h="100vh"
        >
          <Icon name="logo" size="64px" />
          <Stack mt={4} isInline>
            <Button onClick={(e) => auth.signinWithGitHub()}>GitHub</Button>
            <Button isDisabled onClick={(e) => auth.signinWithGoogle()}>
              Google
            </Button>
          </Stack>
        </Flex>
      )}
    </>
  )
}

export default Home
