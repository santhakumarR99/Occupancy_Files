import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MultiSelectDropdown from "../CommonComponents/MultiSelectDropDown";

// Prefer environment variable for API base, fallback to known dev host
const API_BASE = import.meta.env.VITE_API_URL || "http://delbi2dev.deloptanalytics.com:3000";

const EditZone = ({ show, handleClose, onSave, editingZone }) => {
  const RequiredIcon = () => <span style={{ color: "red" }}> *</span>;

  const [entryOptions, setEntryOptions] = useState([]);
  const [exitOptions, setExitOptions] = useState([]);
  // Keep mapping from visible name (before '?') -> unique id (after '?')
  const [entryUniqueMap, setEntryUniqueMap] = useState({});
  const [exitUniqueMap, setExitUniqueMap] = useState({});
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingZone, setLoadingZone] = useState(false);

  const buildInitial = (src = {}) => ({
    zoneName: src?.zoneName || "",
    country: src?.country || "",
    city: src?.city || "",
    threshold: src?.threshold || "",
    capacity: src?.capacity || "",
  serviceAreaEntry: Array.isArray(src?.serviceAreaEntry)
      ? src.serviceAreaEntry
      : (typeof src?.serviceAreaEntry === "string" && src?.serviceAreaEntry)
        ? String(src.serviceAreaEntry)
            .split(",")
            .map((s) => {
              const str = String(s).trim();
        return { label: str, value: str };
            })
        : [],
  serviceAreaExit: Array.isArray(src?.serviceAreaExit)
      ? src.serviceAreaExit
      : (typeof src?.serviceAreaExit === "string" && src?.serviceAreaExit)
        ? String(src.serviceAreaExit)
            .split(",")
            .map((s) => {
              const str = String(s).trim();
        return { label: str, value: str };
            })
        : [],
    remarks: src?.remarks || "",
  });

  const [initialValuesState, setInitialValuesState] = useState(buildInitial(editingZone));

  // Load available entry/exit when modal opens
  useEffect(() => {
    let cancelled = false;
    const fetchOptions = async () => {
  // When editing a zone, rely on getZone API for both available and mapped data
  if (!show || editingZone?.zoneName) return;
      setLoadingOptions(true);
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${API_BASE}/settings/zones/getAvailableEntryExit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({}),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed to load service areas (${res.status})`);
        }
        toast(`(${res.status})`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
   
        const data = await res.json();
        const entryNested = Array.isArray(data?.availableEntry) ? data.availableEntry : [];
        const exitNested = Array.isArray(data?.availableExit) ? data.availableExit : [];
        // API sometimes returns service area under different keys; handle all common variants
        const extractValue = (o) => {
          if (!o) return "";
          return (
            o.ServiceAreaEntry ??
            o.ServiceAreaExit ??
            o.ServiceAreaAvailableEntry ??
            o.ServiceAreaAvailableExit ??
            ""
          );
        };
        const entries = entryNested
          .flat()
          .filter(Boolean)
          .map((o) => String(extractValue(o)).trim())
          .filter(Boolean);
        const exits = exitNested
          .flat()
          .filter(Boolean)
          .map((o) => String(extractValue(o)).trim())
          .filter(Boolean);

    const toOptionsFull = (arr) => {
          const seen = new Set();
          const opts = [];
          for (const raw of arr) {
            const s = String(raw || "").trim();
            if (!s || seen.has(s)) continue; // dedupe only exact duplicates
            seen.add(s);
      opts.push({ label: s, value: s });
          }
          return opts;
        };

        if (!cancelled) {
          setEntryOptions(toOptionsFull(entries));
          setExitOptions(toOptionsFull(exits));
          // Optionally keep maps of full -> suffix for reference
          const toMap = (arr) => {
            const map = {};
            for (const s of arr) {
              const idx = s.indexOf("?");
              if (idx !== -1) map[s] = s.slice(idx + 1);
            }
            return map;
          };
          setEntryUniqueMap(toMap(entries));
          setExitUniqueMap(toMap(exits));
        }
      } catch (err) {
        console.error("Failed to load service area options:", err);
  if (!cancelled) toast.error(err?.message || "Failed to load service areas", { position: "top-center" });
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    };
    fetchOptions();
    return () => {
      cancelled = true;
    };
  }, [show]);

  // Load zone details for editing
  useEffect(() => {
    let cancelled = false;
    const loadZone = async () => {
      if (!show || !editingZone?.zoneName) return;
      setLoadingZone(true);
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${API_BASE}/settings/zones/getZone`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ zonename: editingZone.zoneName }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.success === false) {
          const msg = data?.message || `Failed to load zone (${res.status})`;
          throw new Error(msg);
        }
        const meta = Array.isArray(data?.metaData) && data.metaData[0] ? data.metaData[0] : {};
        const mappedEntry = Array.isArray(data?.mappedEntry) ? data.mappedEntry : [];
        const mappedExit = Array.isArray(data?.mappedExit) ? data.mappedExit : [];
        const availEntryFromZone = Array.isArray(data?.availableEntry) ? data.availableEntry : [];
        const availExitFromZone = Array.isArray(data?.availableExit) ? data.availableExit : [];

        // Build full strings (no trimming before '?')
        const toFull = (arr, key) =>
          arr
            .map((o) => String(o?.[key] || "").trim())
            .filter(Boolean);
        const mappedEntryFull = toFull(mappedEntry, "ServiceAreaMappedEntry");
        const mappedExitFull = toFull(mappedExit, "ServiceAreaMappedExit");
        const availEntryFull = toFull(availEntryFromZone, "ServiceAreaAvailableEntry");
        const availExitFull = toFull(availExitFromZone, "ServiceAreaAvailableExit");

    const toLV = (arr) =>
          arr.map((s) => {
            const str = String(s);
      return { label: str, value: str };
          });

        const newInit = buildInitial({
          zoneName: meta?.ZoneName || editingZone.zoneName,
          country: meta?.Country || editingZone?.country || "",
          city: meta?.City || editingZone?.city || "",
          threshold: meta?.Threshold ?? editingZone?.threshold ?? "",
          capacity: meta?.Capacity ?? editingZone?.capacity ?? "",
          serviceAreaEntry: toLV(mappedEntryFull),
          serviceAreaExit: toLV(mappedExitFull),
          remarks: editingZone?.remarks || "",
        });
        if (!cancelled) {
          // Build dropdown options from available (full strings) + ensure mapped present; dedupe exact duplicates only
      const dedupeLV = (names) => {
            const seen = new Set();
            const out = [];
            for (const n of names) {
              const k = String(n || "").trim();
              if (!k || seen.has(k)) continue;
              seen.add(k);
        out.push({ label: k, value: k });
            }
            return out;
          };
          const entryOptsBuilt = dedupeLV([...availEntryFull, ...mappedEntryFull]);
          const exitOptsBuilt = dedupeLV([...availExitFull, ...mappedExitFull]);
          setEntryOptions(entryOptsBuilt);
          setExitOptions(exitOptsBuilt);

          // Rebuild unique maps keyed by full string -> suffix. Prefer mapped values over available.
          const rebuildMap = (available, mapped) => {
            const map = {};
            for (const s of available) {
              const idx = s.indexOf("?");
              if (idx !== -1) {
                const suffix = s.slice(idx + 1);
                if (!map[s]) map[s] = suffix;
              }
            }
            for (const s of mapped) {
              const idx = s.indexOf("?");
              if (idx !== -1) map[s] = s.slice(idx + 1);
            }
            return map;
          };
          setEntryUniqueMap(rebuildMap(availEntryFull, mappedEntryFull));
          setExitUniqueMap(rebuildMap(availExitFull, mappedExitFull));

          // After options & maps are ready, set initial selected values
          setInitialValuesState(newInit);
        }
      } catch (err) {
        console.error("Failed to load zone details:", err);
  if (!cancelled) toast.error(err?.message || "Failed to load zone details", { position: "top-center" });
        if (!cancelled) setInitialValuesState(buildInitial(editingZone));
      } finally {
        if (!cancelled) setLoadingZone(false);
      }
    };
    loadZone();
    return () => {
      cancelled = true;
    };
  }, [show, editingZone?.zoneName]);

  useEffect(() => {
    // For add mode (no editingZone), set baseline when modal opens.
    // In edit mode, getZone effect will set initial values; avoid overriding it here.
    if (!show || editingZone?.zoneName) return;
    setInitialValuesState(buildInitial(editingZone));
  }, [show, editingZone?.zoneName]);

  const initialValues = initialValuesState;

  const validationSchema = Yup.object().shape({
    zoneName: Yup.string().required("Zone Name is required"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    threshold: Yup.number().typeError("Threshold must be a number").required("Threshold is required").min(0, "Must be >= 0"),
    capacity: Yup.number().typeError("Capacity must be a number").required("Capacity is required").min(0, "Must be >= 0"),
    serviceAreaEntry: Yup.array().min(1, "Service Area Entry is required"),
    serviceAreaExit: Yup.array().min(1, "Service Area Exit is required"),
  });

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" size="lg">
      <Formik
        key={show ? (editingZone?.zoneName || "edit") : "hidden"}
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          const token = sessionStorage.getItem("token");
          const vid = Number(sessionStorage.getItem("vid")) || 4;
          const username = sessionStorage.getItem("username") || "Occupancy";
          const entryList = (values.serviceAreaEntry || []).map((o) => o.value);
          const exitList = (values.serviceAreaExit || []).map((o) => o.value);
          // Build trimmed areas (before '?') and collect unique ids (after '?')
          const parse = (arr) => {
            const areas = [];
            const uniques = [];
            for (const full of arr) {
              const str = String(full || "");
              if (!str) continue;
              const q = str.indexOf("?");
              if (q === -1) {
                areas.push(str.trim());
              } else {
                areas.push(str.slice(0, q).trim());
                const suf = str.slice(q + 1).trim();
                if (suf) uniques.push(suf);
              }
            }
            return { areas, uniques };
          };
          const entryParsed = parse(entryList);
          const exitParsed = parse(exitList);
          // send separate unique id lists for entry and exit
          const sentryuniqueid = Array.from(new Set((entryParsed.uniques || []).filter(Boolean))).join(",");
          const sexituniqueid = Array.from(new Set((exitParsed.uniques || []).filter(Boolean))).join(",");
          try {
            setSubmitting(true);
            const body = {
              vid,
              username,
              Oldzonename: editingZone.zoneName,
              Newzonename: values.zoneName,
              country: values.country,
              city: values.city,
              threshold: Number(values.threshold),
              capacity: Number(values.capacity),
              remarks: values.remarks || "",
              serviceareaentry: entryParsed.areas.join(","),
              serviceareaexit: exitParsed.areas.join(","),
              sentryuniqueid,
              sexituniqueid,
            };
            const res = await fetch(`${API_BASE}/settings/zones/editZone`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify(body),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || data?.success === false) {
              const msg = data?.message || `Failed to update zone (${res.status})`;
              throw new Error(msg);
            }
            toast.success(data?.message || "Zone updated successfully", { position: "top-center" });
            onSave({
              zoneName: values.zoneName,
              country: values.country,
              city: values.city,
              serviceAreaEntry: entryParsed.areas.join(","),
              serviceAreaExit: exitParsed.areas.join(","),
              threshold: Number(values.threshold),
              capacity: Number(values.capacity),
              remarks: values.remarks || "",
            });
            resetForm();
            handleClose();
          } catch (err) {
            toast.error(err?.message || "Failed to update zone", { position: "top-center" });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <FormikForm noValidate onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Zone</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {loadingZone && <div className="m-3 text-muted">Loading zone details...</div>}
              <h6 className="text-muted fw-semibold mb-2">Details</h6>
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
                  <Form.Control.Feedback type="invalid">{errors.zoneName}</Form.Control.Feedback>
                </Form.Group>
              </Row>

              <h6 className="text-muted fw-semibold mb-2">Address</h6>
              <Row>
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
                  <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
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
                  <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                </Form.Group>
              </Row>

              <h6 className="text-muted fw-semibold mb-2">Threshold</h6>
              <Row>
                <Form.Group as={Col} className="m-3">
                  <Form.Label>
                    Threshold <RequiredIcon />
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      name="threshold"
                      type="number"
                      value={values.threshold}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.threshold && !!errors.threshold}
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">{errors.threshold}</Form.Control.Feedback>
                  </InputGroup>
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
                  <Form.Control.Feedback type="invalid">{errors.capacity}</Form.Control.Feedback>
                </Form.Group>
              </Row>

              <h6 className="text-muted fw-semibold mb-2">Service Area</h6>
              <Row>
                <Form.Group as={Col} className="m-3">
                  <Form.Label>
                    Service Area Entry <RequiredIcon />
                  </Form.Label>
                  <MultiSelectDropdown
                    options={entryOptions.map(opt => {
                      const idx = opt.value.indexOf("?");
                      if (idx !== -1) {
                        const visible = opt.value.slice(0, idx);
                        const unique = opt.value.slice(idx + 1);
                        return { ...opt, label: `${visible} (ID: ${unique})` };
                      }
                      return opt;
                    })}
                    value={values.serviceAreaEntry.map(opt => {
                      if (!opt.value) return opt;
                      const idx = opt.value.indexOf("?");
                      if (idx !== -1) {
                        const visible = opt.value.slice(0, idx);
                        const unique = opt.value.slice(idx + 1);
                        return { ...opt, label: `${visible} (ID: ${unique})` };
                      }
                      return opt;
                    })}
                    onChange={(val) => setFieldValue("serviceAreaEntry", val)}
                    placeholder={loadingOptions ? "Loading..." : "Select Service Area Entry"}
                    isInvalid={touched.serviceAreaEntry && !!errors.serviceAreaEntry}
                    error={errors.serviceAreaEntry}
                  />
                </Form.Group>
                <Form.Group as={Col} className="m-3">
                  <Form.Label>
                    Service Area Exit <RequiredIcon />
                  </Form.Label>
                  <MultiSelectDropdown
                    options={exitOptions.map(opt => {
                      const idx = opt.value.indexOf("?");
                      if (idx !== -1) {
                        const visible = opt.value.slice(0, idx);
                        const unique = opt.value.slice(idx + 1);
                        return { ...opt, label: `${visible} (ID: ${unique})` };
                      }
                      return opt;
                    })}
                    value={values.serviceAreaExit.map(opt => {
                      if (!opt.value) return opt;
                      const idx = opt.value.indexOf("?");
                      if (idx !== -1) {
                        const visible = opt.value.slice(0, idx);
                        const unique = opt.value.slice(idx + 1);
                        return { ...opt, label: `${visible} (ID: ${unique})` };
                      }
                      return opt;
                    })}
                    onChange={(val) => setFieldValue("serviceAreaExit", val)}
                    placeholder={loadingOptions ? "Loading..." : "Select Service Area Exit"}
                    isInvalid={touched.serviceAreaExit && !!errors.serviceAreaExit}
                    error={errors.serviceAreaExit}
                  />
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
              <Button className="custom-close-button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button className="custom-save-button" type="submit" variant="primary">
                Save
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};

export default EditZone;


