import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import "../../Components/Styles/CustomButtons.css"
const ZoneFormModal = ({ show, handleClose, onSave, editingZone }) => {
  const RequiredIcon = () => <span style={{ color: "red" }}> *</span>;

  const initialValues = {
    zoneName: editingZone?.zoneName || "",
    country: editingZone?.country || "",
    city: editingZone?.city || "",
    threshold: editingZone?.threshold || "",
    capacity: editingZone?.capacity || "",
    serviceAreaEntry: editingZone?.serviceAreaEntry || "",
    serviceAreaExit: editingZone?.serviceAreaExit || "",
    remarks: editingZone?.remarks || "",
  };

  const validationSchema = Yup.object().shape({
    zoneName: Yup.string().required("Zone Name is required"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    threshold: Yup.number()
      .required("Threshold is required")
      .min(0, "Must be greater than or equal to 0"),
    capacity: Yup.number()
      .required("Capacity is required")
      .min(0, "Must be greater than or equal to 0"),
    serviceAreaEntry: Yup.string().required("Service Area Entry is required"),
    serviceAreaExit: Yup.string().required("Service Area Exit is required"),
  });

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      size="lg"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          onSave(values); // pass to main page
          resetForm();
          handleClose(); // close modal
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <FormikForm noValidate onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>
                {editingZone ? "Edit Zone" : "Add Zone"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Form.Group as={Col} className="m-3">
                  <Form.Label>
                    Zone Name <RequiredIcon />
                  </Form.Label>
                  <Form.Control
                    name="zoneName"
                    value={values.zoneName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.zoneName && !!errors.zoneName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.zoneName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} className="m-3">
                  <Form.Label>
                    Country <RequiredIcon />
                  </Form.Label>
                  <Form.Control
                    name="country"
                    value={values.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.country && !!errors.country}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.country}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} className="m-3">
                  <Form.Label>
                    City <RequiredIcon />
                  </Form.Label>
                  <Form.Control
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.city && !!errors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row>
                <Form.Group as={Col} className="m-3">
                  <Form.Label>
                    Threshold <RequiredIcon />
                  </Form.Label>
                  <Form.Control
                    name="threshold"
                    type="number"
                    value={values.threshold}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.threshold && !!errors.threshold}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.threshold}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} className="m-3">
                  <Form.Label>
                    Capacity <RequiredIcon />
                  </Form.Label>
                  <Form.Control
                    name="capacity"
                    type="number"
                    value={values.capacity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.capacity && !!errors.capacity}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.capacity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row>
                <Form.Group as={Col} className="m-3">
                  <Form.Label>
                    Service Area Entry <RequiredIcon />
                  </Form.Label>
                  <Form.Control
                    name="serviceAreaEntry"
                    value={values.serviceAreaEntry}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      touched.serviceAreaEntry && !!errors.serviceAreaEntry
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.serviceAreaEntry}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} className="m-3">
                  <Form.Label>
                    Service Area Exit <RequiredIcon />
                  </Form.Label>
                  <Form.Control
                    name="serviceAreaExit"
                    value={values.serviceAreaExit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      touched.serviceAreaExit && !!errors.serviceAreaExit
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.serviceAreaExit}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Form.Group className="m-3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="remarks"
                  value={values.remarks}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
              <Button
                className="custom-close-button"
                variant="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                className="custom-save-button"
                type="submit"
                variant="primary"
              >
                {editingZone ? "Update" : "Save"}
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};

export default ZoneFormModal;
