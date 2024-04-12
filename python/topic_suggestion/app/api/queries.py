import asyncio

from api.schemas import Topic
from api.db import edgedb

async def fetch_available_texts():
    # query = Topics.select()
    # return await edgedb.fetch_all(query)
    return [
    {"topic_name": "Artificial Intelligence", "description": "The simulation of human intelligence processes by machines, especially computer systems."},
    {"topic_name": "Machine Learning", "description": "A subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed."},
    {"topic_name": "Deep Learning", "description": "A subset of machine learning where artificial neural networks with multiple layers are used to model and analyze complex patterns in data."},
    {"topic_name": "Natural Language Processing", "description": "A field of artificial intelligence concerned with the interaction between computers and humans in natural language."},
    {"topic_name": "Computer Vision", "description": "A field of computer science that deals with how computers can gain high-level understanding from digital images or videos."},
    {"topic_name": "Robotics", "description": "The interdisciplinary branch of engineering and science that includes mechanical engineering, electronics engineering, computer science, and others."},
    {"topic_name": "Data Science", "description": "A multi-disciplinary field that uses scientific methods, processes, algorithms, and systems to extract knowledge and insights from structured and unstructured data."},
    {"topic_name": "Blockchain", "description": "A decentralized, distributed ledger technology that records the provenance of a digital asset."},
    {"topic_name": "Cryptocurrency", "description": "A digital or virtual currency that uses cryptography for security and operates independently of a central bank."},
    {"topic_name": "Internet of Things (IoT)", "description": "The network of physical devices, vehicles, home appliances, and other items embedded with electronics, software, sensors, actuators, and connectivity which enables these objects to connect and exchange data."},
    {"topic_name": "Cloud Computing", "description": "The delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet to offer faster innovation, flexible resources, and economies of scale."},
    {"topic_name": "Cybersecurity", "description": "The practice of protecting systems, networks, and programs from digital attacks."},
    {"topic_name": "Virtual Reality", "description": "A simulated experience that can be similar to or completely different from the real world."},
    {"topic_name": "Augmented Reality", "description": "An interactive experience of a real-world environment where the objects that reside in the real world are enhanced by computer-generated perceptual information."},
    {"topic_name": "Quantum Computing", "description": "A type of computing that uses quantum-mechanical phenomena, such as superposition and entanglement, to perform operations on data."},
    {"topic_name": "Biotechnology", "description": "The use of living systems and organisms to develop or make products, or "},
    {"topic_name": "Renewable Energy", "description": "Energy collected from resources that are naturally replenished on a human timescale, such as sunlight, wind, rain, tides, waves, and geothermal heat."},
    {"topic_name": "Space Exploration", "description": "The investigation of outer space and celestial bodies."},
    {"topic_name": "Neuroscience", "description": "The scientific study of the nervous system."},
    {"topic_name": "Genomics", "description": "The study of genomes, the complete set of DNA within a single cell of an organism."},
    {"topic_name": "Environmental Conservation", "description": "The practice of protecting the natural environment and wildlife."},
    {"topic_name": "E-commerce", "description": "The buying and selling of goods and services, or the transmitting of funds or data, over an electronic network, primarily the internet."},
    {"topic_name": "Digital Marketing", "description": "The marketing of products or services using digital technologies, mainly on the Internet, but also including mobile phones, display advertising, and any other digital medium."},
    {"topic_name": "Mobile App Development", "description": "The process of creating software applications that run on a mobile device."},
    {"topic_name": "Game Development", "description": "The process of creating video games."},
    {"topic_name": "Art", "description": "The expression or application of human creative skill and imagination."},
    {"topic_name": "Music", "description": "An art form and cultural activity whose medium is sound organized in time."},
    {"topic_name": "Film", "description": "A series of still images that, when shown on a screen, create the illusion of moving images."},
    {"topic_name": "Literature", "description": "Written works, especially those considered of superior or lasting artistic merit."},
    {"topic_name": "History", "description": "The study of past events, particularly in human affairs."},
    {"topic_name": "Philosophy", "description": "The study of general and fundamental questions, such as those about existence, knowledge, values, reason, mind, and language."},
    {"topic_name": "Psychology", "description": "The scientific study of the mind and behavior."},
    {"topic_name": "Sociology", "description": "The study of society, patterns of social relationships, social interaction, and culture."},
    {"topic_name": "Anthropology", "description": "The study of humans, past and present."},
    {"topic_name": "Political Science", "description": "The study of politics and government."},
    {"topic_name": "Economics", "description": "The study of how individuals and societies allocate resources and make choices."},
    {"topic_name": "Physics", "description": "The natural science that studies matter, its motion and behavior through space and time, and the related entities of energy and force."},
    {"topic_name": "Chemistry", "description": "The scientific discipline involved with elements and compounds composed of atoms, molecules, and ions."},
    {"topic_name": "Biology", "description": "The natural science that studies life and living organisms, including their physical structure, chemical processes, molecular interactions, physiological mechanisms, development, and evolution."},
    {"topic_name": "Mathematics", "description": "The study of topics such as quantity, structure, space, and change."},
    {"topic_name": "Engineering", "description": "The application of scientific, mathematical, and empirical evidence to the innovation, design, construction, operation, and maintenance of structures, machines, materials, devices, systems, processes, and organizations."},
    {"topic_name": "Medicine", "description": "The science and practice of the diagnosis, treatment, and prevention of disease."},
    {"topic_name": "Astronomy", "description": "The study of celestial objects such as stars, planets, comets, and galaxies, and phenomena that originate outside the Earth's atmosphere."},
    {"topic_name": "Geology", "description": "The study of the Earth, including its composition, structure, physical properties, and history."},
    {"topic_name": "Meteorology", "description": "The study of weather and atmospheric phenomena."},
    {"topic_name": "Oceanography", "description": "The study of the physical and biological aspects of the ocean."},
    {"topic_name": "Zoology", "description": "The scientific study of animals."},
    {"topic_name": "Botany", "description": "The scientific study of plants."}
    ]