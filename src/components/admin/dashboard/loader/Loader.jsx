import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loader = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height:"100%", width:"100%"}}>
            <CircularProgress color="secondary" />
        </Box>
    );
};

export default Loader;