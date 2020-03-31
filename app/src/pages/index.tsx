import React from "react";
import {
  Stack,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Icon,
} from "@chakra-ui/core";
import Container from "../components/Container";

const IndexPage = () => {
  return (
    <Container>
      <Stack
        as="main"
        spacing={8}
        justifyContent="center"
        alignItems="flex-start"
        m="0 auto 4rem auto"
        maxWidth="700px"
      >
        <Flex
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          maxWidth="700px"
        >
          <InputGroup>
            <InputLeftElement children={<Icon name="search" />} />
            <Input type="search" placeholder="Search topics" />
          </InputGroup>
        </Flex>
      </Stack>
    </Container>
  );
};

export default IndexPage;
