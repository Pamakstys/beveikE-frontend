import {Flex} from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { Button } from '@chakra-ui/react';

const NavigationBar = () => {
    const navigate = useNavigate();
return (
    <Flex justifyContent="space-between" padding="10px" bg="linear-gradient(90deg,rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%);" color="white">
       <Flex alignItems="center">
                <h1 style={{ color: 'white' }}>BeveikE</h1>
        </Flex>
        <Flex alignItems="center">
            <Button colorScheme="teal" variant="outline" marginRight="10px" onClick={() => navigate('/')} _hover={{ bg: 'pink.300', color: 'white' }} >Main Page</Button>
            <Button colorScheme="teal" variant="outline" onClick={() => navigate('/books')} _hover={{ bg: 'pink.300', color: 'white' }} >Books</Button>
            <Button colorScheme="teal" variant="outline" onClick={() => navigate('/unregistered-books')} _hover={{ bg: 'pink.300', color: 'white' }} >Unregistered Books</Button>
        </Flex>
    </Flex>
    );
};
export default NavigationBar;
