import { Grid, Box, Typography } from "@mui/material";
import TaskCard from "../../../../../components/student/widgets/taskBoard/tasks";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const TaskBoard = ({ tasks }) => {
  const navigate = useNavigate();

  const groupedTasks = tasks.reduce((acc, task) => {
    const endDate = format(
      parseISO(task.endDate),
      "EEEE, d 'de' MMMM 'de' yyyy",
      { locale: es }
    );
    if (!acc[endDate]) acc[endDate] = [];
    acc[endDate].push(task);
    return acc;
  }, {});

  const handleTaskClick = (taskId) => {
    navigate(`/group/task/${taskId}`);
  };

  return (
    <Box width="80%">
      {Object.keys(groupedTasks).map((date) => (
        <Box key={date}>
          <Typography
            variant="body1"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" } }}
            mb={2}
          >
            {date}
          </Typography>
          <Grid container spacing={1}>
            {groupedTasks[date].map((task) => (
              <Grid item xs={12} key={task.id}>
                <TaskCard
                  tittle={task.tittle}
                  text={format(parseISO(task.endDate), "HH:mm")}
                  color={"#EFEFEF"}
                  onClick={() => handleTaskClick(task.id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default TaskBoard;
