import React, { useState } from "react";
import Select from "react-select";
import { Modal, Button, Form, Row, Col, Placeholder } from "react-bootstrap";
import { Field, Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import MultiSelectDropdown from "../CommonComponents/MultiSelectDropDown";
import SingleSelectDropdown from "../CommonComponents/SingleSelectDropdown";
SingleSelectDropdown;
const UserFormModal = ({
  show,
  handleClose,
  onSave,
  editingUser,
  Zones,
  userdata,
}) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // For editing
  const RequiredIcon = () => <span style={{ color: "red" }}> *</span>;
  const safeMappedZones = Array.isArray(userdata?.mappedZones)
    ? userdata.mappedZones
    : [];
  console.log(userdata, safeMappedZones,"selectedzones");
  const initialValues = {
    username: editingUser?.username || "",
    useremailid: editingUser?.useremailid || "",
    password: editingUser?.password || "",
    confirmPassword: editingUser?.password || "",
    usertype: editingUser?.usertype || "Operator",
    selectedZones:
      safeMappedZones.map((z) => ({
        label: z.zonename,
        value: z.sl,
      })) || [],
    useraddress: editingUser?.address || "",
    receiveHealthMail: editingUser?.receiveHealthMail || false,
    userblock: editingUser?.userblock || false,
  };
  console.log(editingUser)
  // console.log('receiveHealthMail:',initialValues);
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
          enableReinitialize={true}
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
                    {/* <Form.Select
                      name="usertype"
                      value={values.usertype}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.usertype && !!errors.usertype}
                    >
                      <option value="Operator">Operator</option>
                      <option value="Viewer">Viewer</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.usertype}
                    </Form.Control.Feedback> */}
                    <SingleSelectDropdown
                      options={[
                        { label: "Operator", value: "Operator" },
                        { label: "Viewer", value: "Viewer" },
                      ]}
                      value={
                        values.usertype
                          ? { label: values.usertype, value: values.usertype }
                          : null
                      }
                      onChange={(selected) =>
                        setFieldValue("usertype", selected.value)
                      }
                      isInvalid={touched.usertype && !!errors.usertype}
                    />
                    {touched.usertype && errors.usertype && (
                      <div className="invalid-feedback d-block">
                        {errors.usertype}
                      </div>
                    )}
                  </Form.Group>
                  {/* <Form.Group as={Col} className="mb-3"></Form.Group> */}
                  <Form.Group as={Col} className="mb-3">
                    <Form.Label>
                      Zones
                      <RequiredIcon />
                    </Form.Label>
                    <MultiSelectDropdown
                      options={Zones}
                      value={values.selectedZones}
                      Placeholder ="Select Zones"
                      onChange={(selected) =>
                        setFieldValue("selectedZones", selected)
                       
                      }
                    />
                    {touched.selectedZones && errors.selectedZones && (
                      <div className="invalid-feedback d-block">
                        {errors.selectedZones}
                      </div>
                    )}
                  </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
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
                <Row>
                  {/* <Form.Group as={Col} className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="receiveHealthMail"
                      label="Receive Health Mail"
                      checked={values.receiveHealthMail}
                      onChange={handleChange}
                    />
                  </Form.Group> */}
                  <Form.Group as={Col} className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="receiveHealthMail"
                      label="Receive Health Mail"
                      checked={values.receiveHealthMail} // Bind to Formik state
                      onChange={(e) =>
                        setFieldValue("receiveHealthMail", e.target.checked)
                      } // Update Formik state
                    />
                  </Form.Group>

                  {editingUser && editingUser ? (
                    <Form.Group as={Col} className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="userblock"
                        label="User Block"
                        checked={values.userblock}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  ) : (
                    ""
                  )}
                </Row>
              </Modal.Body>
              <Modal.Footer className="d-flex justify-content-center">
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
