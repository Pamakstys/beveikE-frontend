
import {Flex} from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router';
import { Button } from '@chakra-ui/react';

const NavigationBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
return (
    <Flex justifyContent="space-between" padding="10px" bg="blue.500" color="white">
       <Flex alignItems="center">
                <h1 style={{ color: 'white' }}>BeveikE</h1>
        </Flex>
        <Flex alignItems="center">
            <Button colorScheme="teal" variant="outline" marginRight="10px" onClick={() => navigate('/')} _hover={{ bg: 'pink.300', color: 'white' }} >Main Page</Button>
            <Button colorScheme="teal" variant="outline" onClick={() => navigate('/books')} _hover={{ bg: 'pink.300', color: 'white' }} >Books</Button>
        </Flex>
    </Flex>
    );
};
export default NavigationBar;
