import React, { useRef, useState } from "react";
import {
  Stack,
  Flex,
  Heading,
  Input,
  Button,
  Tag,
  TagLabel,
  TagIcon,
} from "@chakra-ui/core";
import Container from "../components/Container";

const NewGuidePage = () => {
  const inputEl = useRef(null);
  const [state, setState] = useState({
    tags: [],
  });

  const addTag = async () => {
    const input = inputEl.current.value;
    if (!(input == "")) {
      if (!state.tags.find((tag) => tag === input)) {
        setState({ tags: [...state.tags, input] });
      }
      inputEl.current.value = "";
    }
  };
  const removeTag = async (e) => {
    setState({
      tags: state.tags.filter(
        (tag) => tag !== e.currentTarget.id.split("tag-")[1]
      ),
    });
  };

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
          <Stack isInline mt={4} w="100%">
            <Input
              aria-label="Topics for guide"
              placeholder="Enter a topic"
              ref={inputEl}
              type="text"
            />
            <Button fontWeight="bold" size="md" onClick={addTag}>
              Add
            </Button>
          </Stack>
          <Stack isInline flexWrap="wrap" mt={4}>
            {state.tags.map((tag) => (
              <Tag variant="outline" size="lg" mb={2}>
                <TagLabel>{tag}</TagLabel>
                <TagIcon id={`tag-${tag}`} icon="x" onClick={removeTag} />
              </Tag>
            ))}
          </Stack>
        </Flex>
      </Stack>
    </Container>
  );
};

export default NewGuidePage;
