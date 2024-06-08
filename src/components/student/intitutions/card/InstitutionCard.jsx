import { Card, CardContent, Typography, Grid, IconButton } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const InstitutionCard = ({ institution, onClick }) => {
  return (
    <Card
      sx={{
        width: "100%",
        backgroundColor: "#f5f5f5",
        borderRadius: "16px",
        boxShadow: 2,
        cursor: "pointer",
        border: "1px solid #989898",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 4,
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Grid
          container
          alignItems={{ xs: 'left', sm: 'center' }}

          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}

        >
          <Grid item>
            <BusinessIcon sx={{ width: 40, height: 40 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="body1" sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md:"0.9rem" } }}>
              Institución
            </Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem", md:"0.8rem" }, fontWeight: "bold" }}>
              {institution.name}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="body1" sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md:"0.9rem" } }}>
              Responsable
            </Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem", md:"0.8rem" }, fontWeight: "bold" }}>
              {institution.responsible.name}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="body1" sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md:"0.9rem" } }}>
              Teléfono
            </Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem", md:"0.7rem" }, fontWeight: "bold" }}>
              {institution.telephoneNumber}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton>
              <OpenInNewIcon sx={{ color: "#0f0f0f", }}/>
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default InstitutionCard;
