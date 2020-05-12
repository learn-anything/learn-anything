import React, { useRef, useState } from "react";
import {
  Stack,
  Flex,
  Heading,
  InputGroup,
  Input,
  InputRightElement,
  Icon,
  Button,
  Text,
  Divider,
  Tag,
  TagLabel,
  TagIcon,
} from "@chakra-ui/core";
import Container from "../components/Container";

const NewGuidePage = () => {
  const titleInputEl = useRef(null);
  const topicInputEl = useRef(null);
  // TODO: actually validate the title
  const [validName, setValidName] = useState(true);
  const [state, setState] = useState({
    title: null,
    slug: null,
    topics: [],
  });

  const slugify = (str) => {
    const slug = str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    // TODO: display their actual username
    return `/user/$name/guides/${slug}`.replace(/\/\/+/g, "/");
  };

  const addTopic = async () => {
    const input = topicInputEl.current.value;
    if (!(input == "")) {
      if (!state.topics.find((topic) => topic === input)) {
        setState({ ...state, topics: [...state.topics, input] });
      }
      topicInputEl.current.value = "";
    }
  };
  const removeTopic = async (e) => {
    setState({
      ...state,
      topics: state.topics.filter(
        (topic) => topic !== e.currentTarget.id.split("topic-")[1]
      ),
    });
  };
  const updateTitle = async () => {
    const input = titleInputEl.current.value;
    if (input == "") {
      setState({
        ...state,
        title: null,
        slug: null,
      });
    } else {
      setState({
        ...state,
        title: input,
        slug: slugify(input),
      });
    }
  };
  const isValidGuide = async () => {
    if (!state.title) {
      return false;
    }
    return true;
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
          <InputGroup mt={4} w="100%">
            <Input
              aria-label="Title for guide"
              placeholder="Enter a title"
              ref={titleInputEl}
              onChange={updateTitle}
              type="text"
            />
            {state.title && (
              <InputRightElement
                children={
                  <Icon
                    name={validName ? "check" : "alert"}
                    color={validName ? "green.500" : "red.500"}
                  />
                }
              />
            )}
          </InputGroup>
          {state.slug && (
            <Stack isInline>
              <Text>Your guide will be located at: </Text>
              <Text as="b">{state.slug}</Text>
            </Stack>
          )}
          <Divider />
          <Stack isInline mt={4} w="100%">
            <Input
              aria-label="Topics for guide"
              placeholder="Enter a topic"
              ref={topicInputEl}
              type="text"
            />
            <Button fontWeight="bold" size="md" onClick={addTopic}>
              Add
            </Button>
          </Stack>
          <Stack isInline flexWrap="wrap" mt={4}>
            {state.topics.map((topic) => (
              <Tag variant="outline" size="lg" mb={2}>
                <TagLabel>{topic}</TagLabel>
                <TagIcon
                  id={`topic-${topic}`}
                  icon="x"
                  onClick={removeTopic}
                  cursor="pointer"
                />
              </Tag>
            ))}
          </Stack>
          <Button
            as="a"
            p={[1, 4]}
            w="250px"
            fontWeight="bold"
            m="3rem auto 0"
            isDisabled
            variantColor="red"
          >
            Create guide
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
};

export default NewGuidePage;
