import styled from '@emotion/styled';
import { AppBar as MuiAppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
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

const MenuIconButton = styled(IconButton)`
    color: #007BFF;
`;

const StyledButton = styled(Button)`
    margin-left: 10px;
    background-color: #28a745;
    &:hover {
        background-color: #218838;
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

    return (
        <div>
            <StyledAppBar position="static">
                <Toolbar>
                    <Title variant="h6" style={{ flexGrow: 1 }} onClick={() => history('/')}>
                        Personal Book Library
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