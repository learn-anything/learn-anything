import React from "react";
import NextLink from "next/link";
import { Heading, Flex, Stack, Button } from "@chakra-ui/core";
import Container from "../components/Container";

const ErrorPage = () => {
  return (
    <Container>
      <Stack
        justifyContent="center"
        alignItems="flex-start"
        m="0 auto 4rem auto"
        maxWidth="700px"
        w="100%"
      >
        <Flex
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          maxWidth="700px"
          w="100%"
        >
          <Heading letterSpacing="tight">404 – Page Not Found</Heading>
          <NextLink href="/" passHref>
            <Button
              as="a"
              p={[1, 4]}
              w="250px"
              fontWeight="bold"
              m="3rem auto 0"
            >
              Return Home
            </Button>
          </NextLink>
        </Flex>
      </Stack>
    </Container>
  );
};

export default ErrorPage;
