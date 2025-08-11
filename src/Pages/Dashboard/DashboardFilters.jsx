import React from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";
import Select from "react-select";
import { Formik } from "formik";
import MultiSelectDropdown from "../CommonComponents/MultiSelectDropDown";

const DashboardFiltersModal = ({ show, onClose, onApply }) => {
  const RequiredIcon = () => <span style={{ color: "red" }}> *</span>;
  const countryOptions = [
    { label: "India", value: 1 },
    { label: "USA", value: 2 },
  ];
  const cityOptions = [
    { label: "Chennai", value: 1 },
    { label: "Bangalore", value: 2 },
    { label: "Coimbatore", value: 3 },
  ];
  const zoneOptions = [
    { label: "Zone A", value: 1 },
    { label: "Zone B", value: 2 },
    { label: "Zone C", value: 3 },
  ];

//   const defaultValues = {
//     countries: [],
//     cities: [],
//     zones: [],
//     ...initialValues,
//   };
const initialValues ={
 countries : [],
 cities:[],
 zones:[]
}
  return (
    <Modal show={show} onHide={onClose} centered size="sm">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
            console.log(values)
          onApply(values); // Pass to parent
        }}
      >
        {({ values, handleSubmit, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Filters</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group as={Col} className="mb-3">
                <Form.Label>
                  Countries
                </Form.Label>
                <MultiSelectDropdown
                  options={countryOptions}
                  value={values.countries}
                  onChange={(selected) => setFieldValue("countries", selected)}
                />
              </Form.Group>

              <Form.Group  as={Col} className="mb-3">
                <Form.Label>Cities</Form.Label>
                <MultiSelectDropdown
                  options={cityOptions}
                  value={values.cities}
                  onChange={(selected) => setFieldValue("cities", selected)}
                />
              </Form.Group>

              <Form.Group  as={Col} className="mb-3">
                <Form.Label>Zones <RequiredIcon /></Form.Label>
                <MultiSelectDropdown
                  options={zoneOptions}
                  value={values.zones}
                  onChange={(selected) => setFieldValue("zones", selected)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Apply
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default DashboardFiltersModal;
