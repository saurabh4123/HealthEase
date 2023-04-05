import axios from "axios";

const unassignedPatientListAPI = `http://localhost:9080/api/supervisor/get-valid-patients/`;

const fieldWorkerListAPI = `http://localhost:9080/api/supervisor/get-fieldworker-list/`;

const assignFieldworkerAPI = (patientID, fieldWorkerID) =>
  `http://localhost:9080/api/supervisor/assign-fieldworker/${patientID}/${fieldWorkerID}`;

const reassignFieldworkerAPI = (oldFieldWorkerID, reassignedFieldWorkerID) =>
  `http://localhost:9080/api/supervisor/reassign-fieldworker/${oldFieldWorkerID}/${reassignedFieldWorkerID}`;

const dueVisitsByFieldWorkerAPI = `http://localhost:9080/api/supervisor/due-visits`;

const reassignFieldworkerChangeDueDateAPI = (patientID, newFieldWorkerID) =>
  `http://localhost:9080/api/supervisor/reassign-field-worker-pid/${patientID}/${newFieldWorkerID}`;

async function getPatientList() {
  const responseData = await axios.get(unassignedPatientListAPI);
  return responseData;
}

async function getFieldworkerList() {
  const responseData = await axios.get(fieldWorkerListAPI);
  return responseData;
}

async function assignFieldworker(patientID, fieldWorkerID) {
  const responseData = await axios.post(
    assignFieldworkerAPI(patientID, fieldWorkerID)
  );
  return responseData;
}

async function reassignFieldWorker(oldFieldWorkerID, reassignedFieldWorkerID) {
  const responseData = await axios.get(
    reassignFieldworkerAPI(oldFieldWorkerID, reassignedFieldWorkerID)
  );
  return responseData;
}

async function dueVisits() {
  const responseData = await axios.get(dueVisitsByFieldWorkerAPI);
  return responseData;
}

async function reassignFieldworkerAndDueDate(patientID, newFieldWorkerID) {
  const responseData = await axios.get(
    reassignFieldworkerChangeDueDateAPI(patientID, newFieldWorkerID)
  );
  return responseData;
}

export {
  getPatientList,
  getFieldworkerList,
  assignFieldworker,
  reassignFieldWorker,
  dueVisits,
  reassignFieldworkerAndDueDate,
};
