import React, { useState } from "react";
import Select from "react-select";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Field, Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import MultiSelectDropdown from "../CommonComponents/MultiSelectDropDown";

const UserFormModal = ({ show, handleClose, onSave, editingUser, Zones }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // For editing
  const RequiredIcon = () => <span style={{ color: "red" }}> *</span>;
  console.log(Zones);
  const initialValues = {
    username: editingUser?.username || "",
    useremailid: editingUser?.useremailid || "",
    password: editingUser?.password || "",
    confirmPassword: editingUser?.confirmPassword || "",
    usertype: editingUser?.usertype || "Operator",
    selectedZones:
      editingUser?.selectedZones?.split(":").map((z) => ({
        label: z.Zonename,
        value: z.Sl,
      })) || [],
    useraddress: editingUser?.useraddress || "",
    receiveHealthMail: editingUser?.receiveHealthMail || false,
    userblock: editingUser?.userblock|| false
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .max(20, "Max 20 characters")
      .required("User name is required"),
    useremailid: Yup.string()
      .required("Email is required")
      .test("valid-emails", "Invalid email format(s)", (value) => {
        if (!value) return false;
        const emails = value.split(";").map((e) => e.trim());
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emails.every((email) => emailRegex.test(email));
      }),
    password: Yup.string()
      .min(6, "Min 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
    usertype: Yup.string().required("User Type is required"),
    selectedZones: Yup.array().min(1, "Select at least one zone"),
    // address: Yup.string().required('Address is required'),
  });

  return (
    <>
      <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            onSave(values); // pass to main page
            resetForm();
            handleClose(); // close modal
          }}
          // onSubmit={(values) => {
          //   console.log("FORM VALUES:", values);
          // }}
        >
          {({
            handleChange,
            setFieldValue,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {editingUser ? "Edit User" : "Add User"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Form.Group as={Col} className="mb-3">
                    <Form.Label>
                      User
                      <RequiredIcon />
                    </Form.Label>
                    <Form.Control
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.username && !!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} className="mb-3">
                    <Form.Label>
                      Email <RequiredIcon />
                    </Form.Label>
                    <Form.Control
                      name="useremailid"
                      value={values.useremailid}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.useremailid && !!errors.useremailid}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.useremailid}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group as={Col} className="mb-3">
                    <Form.Label>
                      Password
                      <RequiredIcon />
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.password && !!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} className="mb-3">
                    <Form.Label>
                      Confirm Password
                      <RequiredIcon />
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        touched.confirmPassword && !!errors.confirmPassword
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group as={Col} className="mb-3">
                    <Form.Label>
                      User Type
                      <RequiredIcon />
                    </Form.Label>
                    <Form.Select
                      name="usertype"
                      value={values.usertype}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.usertype && !!errors.usertype}
                    >
                      {/* <option value="Admin">Admin</option> */}
                      <option value="Operator">Operator</option>
                      <option value="Viewer">Viewer</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.usertype}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} className="mb-3">
                    <Form.Label>
                      Zones
                      <RequiredIcon />
                    </Form.Label>
                    <MultiSelectDropdown
                      options={Zones}
                      value={values.selectedZones}
                      onChange={(selected) => setFieldValue("selectedZones", selected)}
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Address
                    <RequiredIcon />
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="useraddress"
                    value={values.useraddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.useraddress && !!errors.useraddress}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.useraddress}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="receiveHealthMail"
                    label="Receive Health Mail"
                    checked={values.receiveHealthMail}
                    onChange={handleChange}
                  />
                  {editingUser && editingUser ?
                  <Form.Check
                    type="checkbox"
                    name="userblock"
                    label="User Block"
                    checked={values.userblock}
                    onChange={handleChange}
                  />:""}
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editingUser ? "Update" : "Save"}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default UserFormModal;

