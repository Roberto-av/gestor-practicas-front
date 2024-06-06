import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const CustomCard = ({ icon: Icon, title, subtitle, optionalTitle, optionalSubtitle }) => {
  return (
    <Card
      sx={{
        width: { xs: '80%', sm: '90%', md: '80%', lg: '90%' },
        height: { xs: 'auto', sm: 'auto', md: 110, lg: 'auto' },
        m: 1,
        backgroundColor: "#DCDFE4",
        borderRadius: "16px",
        padding: '10px',
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Icon sx={{ width: { xs: 30, sm: 40, md: 50 }, height: { xs: 30, sm: 40, md: 50 } }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h6" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="subtitle1" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.9rem' } }}>
                {subtitle}
              </Typography>
            )}
          </Grid>
          <Grid item>
            <Typography variant="h6" sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' } }}>
              {optionalTitle}
            </Typography>
            {optionalSubtitle && (
              <Typography variant="subtitle1" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                {optionalSubtitle}
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
