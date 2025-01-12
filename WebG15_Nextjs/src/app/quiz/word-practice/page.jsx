'use client';

import Image from 'next/image';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const WordPracticePage = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 4 }}>
    <Typography variant="h3" fontWeight="bold" color="primary">
      Coming Soon!
    </Typography>
    <Image
      src="/comingSoon.jpg" // Replace with your "coming soon" image path in the public folder
      alt="Coming Soon"
      width={400}
      height={400}
      style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
    />
  </Box>
);

export default WordPracticePage;
