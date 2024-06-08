import { Card, CardContent, Typography, Grid } from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

const TaskCard = ({ tittle, text, description, color, colorText, onClick, borderColor }) => {
  return (
    <Card
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: color,
        border: borderColor ? borderColor : "1px solid #989898",
        borderRadius: "16px",
        boxShadow: 2,
        cursor: "pointer",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 4,
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <AssignmentOutlinedIcon
              sx={{
                width: { xs: 30, sm: 30 , md: 30 },
                height: { xs: 30, sm: 30, md: 30 },
              }}
            />
          </Grid>
          <Grid item xs>
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" } }}
            >
              {tittle}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" } }}
            >
              {description}
            </Typography>
          </Grid>
          <Grid item xs={3} textAlign="right">
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" }, color: colorText }}
            >
              {text}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
