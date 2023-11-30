const diagnostics = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');

// GET Route for retrieving diagnostic information
diagnostics.get('/', (req, res) => {
  readFromFile('./db/diagnostics.json')
    .then((data) => {
      const diagnosticsData = JSON.parse(data);
      res.status(200).json(diagnosticsData);
    })
    .catch((err) => {
      res.status(500).send('Error retrieving diagnostics information');
    });
});

// POST Route for error logging
diagnostics.post('/', (req, res) => {
  const { formData } = req.body;
  if (!formData) {
    return res.status(400).send('Invalid data');
  }

  const newDiagnostic = {
    id: uuidv4(),
    formData,
    timestamp: Date.now(),
  };

  readAndAppend('./db/diagnostics.json', JSON.stringify(newDiagnostic) + '\n')
    .then(() => {
      res.status(201).json({ message: 'Data logged successfully' });
    })
    .catch((err) => {
      res.status(500).send('Error logging data');
    });
});

module.exports = diagnostics;