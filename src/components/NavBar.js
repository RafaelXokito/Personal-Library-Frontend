import styled from '@emotion/styled';
import { AppBar as MuiAppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(MuiAppBar)`
    background: linear-gradient(45deg, #5a7d9a, #b0c7d4);
    border-radius: 10px;
`;

const Title = styled(Typography)`
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;

function NavBar() {
    const history = useNavigate();

    const userData = JSON.parse(localStorage.getItem("userData"));

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const handleLogout = () => {
        localStorage.clear(); // This will clear all the items in the localStorage
        window.location.reload();
    }

    const handleWriteABookPage = () => {
        history('/write-a-book');
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    return (
        <div>
            <StyledAppBar position="static">
                <Toolbar>
                    <Title variant="h6" style={{ flexGrow: 1 }} onClick={() => history('/')}>
                        Personal Book Library | {isLoggedIn ? capitalizeFirstLetter(String(userData?.role)) : "Guest"}
                    </Title>
                    <Button color="inherit" onClick={() => history('/')}>
                        All Books
                    </Button>
                    {isLoggedIn ? (
                        <>
                            {userData?.role === "WRITER" ? 
                            <Button color="inherit" onClick={handleWriteABookPage}>
                                Write a Book
                            </Button> : null}
                            <Button color="inherit" onClick={() => history('/my-books')}>
                                {userData?.role === "WRITER" ? "My Artworks" : "My Reading Books"}
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button color="inherit" onClick={() => history('/login')}>
                            Login
                        </Button>
                    )}
                </Toolbar>
            </StyledAppBar>
        </div>
    );
}

export default NavBar;