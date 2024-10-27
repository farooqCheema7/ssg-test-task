// components/Layout.tsx
import React, { ReactNode } from 'react';
import { Container, Box, Typography } from '@mui/material';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          padding: 2,
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

export default Layout;
