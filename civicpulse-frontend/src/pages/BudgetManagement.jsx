import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllBudgets } from "../services/budgetApi";

function BudgetManagement() {
  const [budgets, setBudgets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const data = await getAllBudgets();
      setBudgets(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Budget Management
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => navigate("/budgets/add")}
      >
        Add Budget
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Financial Year</TableCell>
              <TableCell>Total Budget</TableCell>
              <TableCell>Allocated</TableCell>
              <TableCell>Spent</TableCell>
              <TableCell>Remaining</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {budgets.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell>{budget.id}</TableCell>
                <TableCell>{budget.department}</TableCell>
                <TableCell>{budget.financialYear}</TableCell>
                <TableCell>{budget.totalBudget}</TableCell>
                <TableCell>{budget.allocatedAmount}</TableCell>
                <TableCell>{budget.spentAmount}</TableCell>
                <TableCell>{budget.remainingAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default BudgetManagement;