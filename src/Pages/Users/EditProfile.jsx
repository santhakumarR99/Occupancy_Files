import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import MultiSelectDropdown from "../CommonComponents/MultiSelectDropDown";
import SingleSelectDropdown from "../CommonComponents/SingleSelectDropdown";
import "../../Components/Styles/UsersPage.css";
const EditProfile = ({
  show,
  handleClose,
  onSave,
  editingUser,
  selectedMainuser,
  isSaving,
}) => {
  const [profileData, setProfileData] = useState({});
  const [allZones, setAllZones] = useState([]);
  const [mappedZones, setAllMappedZones] = useState([]);
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    if (
      Array.isArray(selectedMainuser?.user) &&
      selectedMainuser.user.length > 0
    ) {
      setProfileData(selectedMainuser.user[0]);
      if (Array.isArray(selectedMainuser?.mappedZones)) {
        setAllMappedZones(selectedMainuser.mappedZones);
      }
      if (Array.isArray(selectedMainuser?.allZones)) {
        setAllZones(selectedMainuser.allZones);
      }
    }
  }, [selectedMainuser]);
  const AllZones = allZones.map((zone) => ({
    label: zone.zonename,
    value: zone.sl,
  }));
  console.log(selectedMainuser);
  const RequiredIcon = () => <span style={{ color: "red" }}> *</span>;

  const getInitialValues = () => ({
    username: profileData?.username || "",
    useremailid: profileData?.useremailid || "",
    password: profileData?.password || "",
    confirmPassword: profileData?.password || "",
    usertype: profileData?.usertype || "",
    selectedZones:
      mappedZones.map((z) => ({
        label: z.zonename,
        value: z.sl,
      })) || [],
    useraddress: profileData?.address || "",
    receiveHealthMail: profileData?.receiveHealthMail || false,
    // userblock: profileData?.userblock || false,
  });

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Minimum 3 characters is required")
      .max(20, "Maximum 20 characters only!")
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
      .min(6, "Minimum 6 characters")
      .max(20, "Password length 6 to 20 only!")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={async (values, { resetForm }) => {
          await onSave(values); // ✅ Await the save
          resetForm(); // ✅ Reset only after save
          handleClose(); // ✅ Close modal after save
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>
                {profileData ? "Edit Profile" : "Add Profile"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Label>
                    User <RequiredIcon />
                  </Form.Label>
                  <Form.Control
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.username && !!errors.username}
                    disabled={!!profileData}
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
                    Password <RequiredIcon />
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
                    Confirm Password <RequiredIcon />
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
                <Form.Group as={Col} className="mb-3 receivehealth">
                  <Form.Check
                    type="checkbox"
                    name="receiveHealthMail"
                    label="Receive Health Mail"
                    checked={values.receiveHealthMail}
                    onChange={(e) =>
                      setFieldValue("receiveHealthMail", e.target.checked)
                    }
                  />
                </Form.Group>
              </Row>
            </Modal.Body>
            <Modal.Footer className="d-flex flex-column align-items-center">
              <div className="d-flex gap-2">
                <Button
                  variant="primary btn-sm"
                  onClick={handleClose}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary btn-sm actv"
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <> {profileData ? "Updating..." : "Saving..."}</>
                  ) : profileData ? (
                    "Update"
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
              {isSaving && (
                <div className="mt-2">
                  <span
                    className="spinner-border text-primary"
                    role="status"
                    style={{ width: "1.5rem", height: "1.5rem" }}
                  ></span>
                </div>
              )}
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditProfile;
