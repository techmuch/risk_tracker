import React, { useState, useEffect, useCallback } from "react";
import PouchDB from "pouchdb";
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Slider,
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";
import "./App.css";

function App() {
  const [project, setProject] = useState({
    id: "",
    name: "",
    created_at: "",
    last_updated: "",
  });
  const [risks, setRisks] = useState([]);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const db = new PouchDB("risks");

  const fetchProject = useCallback(async () => {
    try {
      const doc = await db.get("project");
      setProject(doc);
    } catch (err) {
      if (err.name === "not_found") {
        const newProject = {
          _id: "project",
          id: Date.now().toString(),
          name: "New Project",
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        };
        await db.put(newProject);
        setProject(newProject);
      }
    }
  }, [db]);

  const fetchRisks = useCallback(async () => {
    const result = await db.allDocs({ include_docs: true });
    const fetchedRisks = result.rows
      .map((row) => row.doc)
      .filter((doc) => doc._id !== "project");

    // Ensure all risks have an assessments array
    const validRisks = fetchedRisks.map((risk) => {
      if (!risk.assessments || !Array.isArray(risk.assessments)) {
        risk.assessments = [
          {
            likelihood: 0,
            impact: 0,
            assessed_at: new Date().toISOString(),
          },
        ];
      }
      return risk;
    });

    setRisks(validRisks);
  }, [db]);

  useEffect(() => {
    fetchProject();
    fetchRisks();
  }, [fetchProject, fetchRisks]);

  const createRisk = async () => {
    const newRisk = {
      _id: Date.now().toString(),
      id: Date.now().toString(),
      order: risks.length,
      title: "New Risk",
      description: "",
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      assessments: [
        {
          likelihood: 0,
          impact: 0,
          assessed_at: new Date().toISOString(),
        },
      ],
      comments: [],
    };
    await db.put(newRisk);
    await fetchRisks();
    setSelectedRisk(newRisk);
  };

  const updateRisk = async (updatedRisk) => {
    try {
      updatedRisk.last_updated = new Date().toISOString();
      await db.put(updatedRisk);
    } catch (err) {
      if (err.name === "conflict") {
        // Fetch the latest version of the document
        const latestRisk = await db.get(updatedRisk._id);
        // Merge the changes
        const mergedRisk = {
          ...latestRisk,
          ...updatedRisk,
          _rev: latestRisk._rev, // Use the latest revision
        };
        // Try to update again
        await db.put(mergedRisk);
      } else {
        console.error("Error updating risk:", err);
      }
    }
    fetchRisks();
  };

  // eslint-disable-next-line no-unused-vars
  const addComment = async (risk, comment) => {
    const updatedRisk = {
      ...risk,
      comments: [
        ...risk.comments,
        {
          user: "Current User",
          comment: comment,
          commented_at: new Date().toISOString(),
        },
      ],
      last_updated: new Date().toISOString(),
    };
    await updateRisk(updatedRisk);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="static" sx={{ flexGrow: 0 }}>
        <Toolbar>
          <Typography variant="h6">Risk Tracker</Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <Paper sx={{ width: "20%", p: 2, overflow: "auto" }}>
          <Typography variant="h6">Project: {project.name}</Typography>
        </Paper>
        <Paper sx={{ width: "30%", p: 2, overflowY: "auto" }}>
          <List>
            {risks.map((risk) => (
              <ListItem
                button
                key={risk._id}
                onClick={() => setSelectedRisk({ ...risk })}
              >
                <ListItemText primary={risk.title} />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" color="primary" onClick={createRisk}>
            Create New Risk
          </Button>
        </Paper>
        <Paper sx={{ width: "50%", p: 2, overflow: "auto" }}>
          {selectedRisk ? (
            <form
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
              onSubmit={(e) => {
                e.preventDefault();
                updateRisk({
                  ...selectedRisk,
                  _rev: selectedRisk._rev, // Include the _rev field
                });
              }}
            >
              <TextField
                label="Title"
                value={selectedRisk.title || ""}
                onChange={(e) =>
                  setSelectedRisk({ ...selectedRisk, title: e.target.value })
                }
              />
              <TextField
                label="Description"
                multiline
                rows={4}
                value={selectedRisk.description || ""}
                onChange={(e) =>
                  setSelectedRisk({
                    ...selectedRisk,
                    description: e.target.value,
                  })
                }
              />
              <Typography gutterBottom>Likelihood</Typography>
              <Slider
                value={
                  selectedRisk.assessments &&
                  selectedRisk.assessments.length > 0
                    ? selectedRisk.assessments[
                        selectedRisk.assessments.length - 1
                      ].likelihood
                    : 0
                }
                onChange={(_, newValue) => {
                  const newAssessments = selectedRisk.assessments
                    ? [...selectedRisk.assessments]
                    : [];
                  const lastAssessment =
                    newAssessments.length > 0
                      ? newAssessments[newAssessments.length - 1]
                      : {};
                  newAssessments[newAssessments.length - 1] = {
                    ...lastAssessment,
                    likelihood: newValue,
                    assessed_at: new Date().toISOString(),
                  };
                  setSelectedRisk({
                    ...selectedRisk,
                    assessments: newAssessments,
                  });
                }}
                step={0.1}
                marks
                min={0}
                max={1}
                valueLabelDisplay="auto"
              />
              <Typography gutterBottom>Impact</Typography>
              <Slider
                value={
                  selectedRisk.assessments &&
                  selectedRisk.assessments.length > 0
                    ? selectedRisk.assessments[
                        selectedRisk.assessments.length - 1
                      ].impact
                    : 0
                }
                onChange={(_, newValue) => {
                  const newAssessments = selectedRisk.assessments
                    ? [...selectedRisk.assessments]
                    : [];
                  const lastAssessment =
                    newAssessments.length > 0
                      ? newAssessments[newAssessments.length - 1]
                      : {};
                  newAssessments[newAssessments.length - 1] = {
                    ...lastAssessment,
                    impact: newValue,
                    assessed_at: new Date().toISOString(),
                  };
                  setSelectedRisk({
                    ...selectedRisk,
                    assessments: newAssessments,
                  });
                }}
                step={0.1}
                marks
                min={0}
                max={1}
                valueLabelDisplay="auto"
              />
              <Button type="submit" variant="contained" color="primary">
                {selectedRisk._id ? "Update Risk" : "Create Risk"}
              </Button>
            </form>
          ) : (
            <Typography>
              Select a risk to view details or create a new risk
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default App;
