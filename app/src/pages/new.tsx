import React from "react";
import { Stack, Flex, Heading } from "@chakra-ui/core";
import Container from "../components/Container";

const NewGuidePage = () => {
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
          <Heading letterSpacing="tight">Create a new guide</Heading>
        </Flex>
      </Stack>
    </Container>
  );
};

export default NewGuidePage;
