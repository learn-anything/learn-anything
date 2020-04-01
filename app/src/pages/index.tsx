import React from "react";
import {
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
      <Flex flexDirection="row" justifyContent="center" alignItems="center">
        <InputGroup maxWidth="700px" flex="1">
          <InputLeftElement children={<Icon name="search" />} />
          <Input type="search" placeholder="Search topics" />
        </InputGroup>
      </Flex>
    </Container>
  );
};

export default IndexPage;
