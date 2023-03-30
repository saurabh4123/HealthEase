import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllPatients } from "../services/doctorServices";

function DDashboard() {
  const state = useLocation().state;
  const navigate = useNavigate();
  const [doctorID, setDoctorID] = useState(null);
  const [patientList, setPatientList] = useState([]);

  useEffect(() => {
    (async function () {
      setDoctorID(state.d_id);
      const responseData = await getAllPatients(state.d_id);
      const data = responseData.data;
      console.log(data);
      if (data) {
        setPatientList(
          data.filter((e) => {
            return e.treated === false;
          })
        );
      } else {
        console.log("error! ");
      }
    })();
  }, [state.d_id]);

  function onCheckUPButtonClicked(p, event) {
    console.log(p.a_id);
    const index = Number(event.target.value);
    setPatientList((list) => {
      let filteredList = list.filter((_, i) => {
        return i !== index;
      });
      console.log(filteredList);
      return [...filteredList];
    });

    navigate("/diagnose-patient", {
      state: {
        doctorID: doctorID,
        a_id: p.a_id,
        patientObj: p.patient,
      },
    });
  }

  function viewAnyPatientHistory() {
    navigate("/view-any-patient-history", {
      state: {
        d_id: doctorID,
      },
    });
  }

  function viewNewVisitRecords() {
    navigate("/view-new-visit-records", {
      state: {
        doctorID: doctorID,
      },
    });
  }

  return (
    <div className="paddingPage">
      <div style={{ textAlign: "center" }}>
        <label className="tableHeading">Doctor Dashboard</label>
      </div>
      <div style={{ textAlign: "right" }}>
        <span style={{ margin: "10px" }}>
          <button className="button" onClick={viewAnyPatientHistory}>
            View Patient History
          </button>
        </span>
        <span style={{ margin: "10px" }}>
          <button className="button" onClick={viewNewVisitRecords}>
            View New Visit Records
          </button>
        </span>
      </div>
      <div>
        <div>
          <label className="tableHeading">
            Upcoming Patients: {patientList.length}
          </label>
        </div>
        <table>
          <tbody>
            <tr>
              <th>A_No.</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
            </tr>
          </tbody>
          <tbody>
            {patientList.map((p, i) => {
              return (
                <tr key={p.a_id}>
                  <th>{p.a_id}</th>
                  <th>{p.patient.name}</th>
                  <th>{p.patient.age}</th>
                  <th>{p.patient.gender}</th>
                  <td>
                    <button
                      className="button"
                      value={i}
                      onClick={(event) => onCheckUPButtonClicked(p, event)}
                    >
                      Check-up
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DDashboard;
