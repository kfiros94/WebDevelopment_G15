'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation'; // For routing
import withAuth from '@/components/withAuth'; // Authentication wrapper

// Button configuration
const buttons = [
  {
    url: '/quizImages/practice.jpg', // Local image path for Word Practice
    title: 'Word Practice',
    description: 'Improve your Hebrew vocabulary by practicing your saved words.',
    width: '40%',
    path: '/quiz/word-practice',
  },
  {
    url: '/quizImages/testYourself.jpg',
    title: 'Test Your Hebrew Level',
    description: 'Take a fun quiz to check your proficiency.',
    width: '30%',
    path: '/quiz/test-level',
  },
  {
    url: '/quizImages/AIChat.jpg',
    title: 'Learn with AI',
    description: 'Interact with AI-powered learning sessions.',
    width: '30%',
    path: '/quiz/learn-with-ai',
  },
  {
    url: '/quizImages/cards.jpg',
    title: 'Hebrew Cards',
    description: 'Flip cards to reveal words and meanings.',
    width: '40%',
    path: '/quiz/hebrew-cards',
  },
];

// Styled components for buttons
const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 200,
  [theme.breakpoints.down('sm')]: {
    width: '100% !important',
    height: 100,
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor',
    },
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '0 16px',
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
}));

// Styled headline
const StyledHeadline = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 900,
  textAlign: 'center',
  background: 'linear-gradient(to right, #4facfe, #00f2fe)',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
  animation: 'fade-in 1s ease-out, scale-in 1.2s ease-in-out',
  '@keyframes fade-in': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  '@keyframes scale-in': {
    '0%': { transform: 'scale(0.9)' },
    '100%': { transform: 'scale(1)' },
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
}));

const Quiz = () => {
  const router = useRouter();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, p: 4 }}>
      {/* Huge headline */}
      <StyledHeadline component="h1">
        Ready to Level Up Your Hebrew?
      </StyledHeadline>

      {/* Buttons section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 300, width: '100%', gap: 4, justifyContent: 'center' }}>
        {buttons.map((button) => (
          <ImageButton
            key={button.title}
            style={{ width: button.width }}
            onClick={() => router.push(button.path)}
          >
            <ImageSrc style={{ backgroundImage: `url(${button.url})` }} />
            <ImageBackdrop className="MuiImageBackdrop-root" />
            <Image>
              <Typography component="span" variant="h5" fontWeight="bold" gutterBottom>
                {button.title}
              </Typography>
              <Typography component="span" variant="body2">
                {button.description}
              </Typography>
              <ImageMarked className="MuiImageMarked-root" />
            </Image>
          </ImageButton>
        ))}
      </Box>
    </Box>
  );
};

export default withAuth(Quiz);
