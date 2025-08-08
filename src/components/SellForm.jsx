import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import OrgInput from "./common/OrgInput";
import OrgBranchInput from "./common/OrgBranchInput";
import ModelInput from "./common/ModelInput";
import DeviceInput from "./common/DeviceInput";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getOneStock } from "../apis/StockApi";
import CustomerInput from "./common/CustomerInput";
import { getOneCustomer } from "../apis/CustomerApi";
import { errorMessage, formatMessage, lengthMessage } from "../../errorMessage";
import { createSell, getOneSell, updateSell } from "../apis/SellApi";
import PaymentInput from "./common/PaymentInput";
import CircularProgress from "@mui/material/CircularProgress";

const SellForm = ({ stock }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    organization: null,
    branch: null,
    customerName: null,
    customerPhone: "",
    device: [
      {
        modelName: null,
        deviceName: null,
        paymentType: "",
        amount: "",
        customerPaid: "",
        remainingAmount: "",
        upload: "",
        totalAmount: "",
      },
    ],
    payment: [
      {
        paymentAccount: null,
        paymentAmount: "",
      },
    ],
    stock: "",
  });

  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [branchId, setBranchId] = useState("");
  const [modelId, setModelId] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [paymentId, setPaymentId] = useState("");

  const [loggedUserData, setLoggedUserData] = useState({});
  const [adjustAmount, setAdjustAmount] = useState();
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const location = useLocation();

  const sellCreateFromStock = location.pathname.includes(
    "/stockPage/sellForm/"
  );

  console.log("updateFromLedger ", sellCreateFromStock);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const file = files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      // Now you can store base64 in your form state or send it to your database
      setFormData((prev) => ({ ...prev, upload: base64 }));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // This returns base64 with data:[mime];base64,...
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleOrganizationChange = (selectedOrg) => {
    setSelectedOrganization(selectedOrg.value);
    setFormData((prev) => ({
      ...prev,
      organization: selectedOrg,
    }));
  };

  const handleOrganizationBranchChange = (selectedOrgBranch) => {
    setBranchId(selectedOrgBranch.value);
    setFormData((prev) => ({
      ...prev,
      branch: selectedOrgBranch,
    }));
  };

  const handleCustomerChange = async (selectCustomer) => {
    if (selectCustomer && selectCustomer !== null) {
      const findCustomerPhoneNumber = await getOneCustomer(
        selectCustomer.value
      );

      setFormData({
        ...formData,
        customerPhone: findCustomerPhoneNumber?.data?.data?.customerPhone || "",
      });
    } else {
      setFormData({
        ...formData,
        customerPhone: "",
      });
    }

    setFormData((prev) => ({
      ...prev,
      customerName: selectCustomer,
    }));
  };

  const handleModelChange = (index, selectedModel) => {
    setModelId(selectedModel.value);
    setFormData((prev) => {
      const updatedDevices = [...prev.device];
      updatedDevices[index] = {
        ...updatedDevices[index],
        modelName: selectedModel,
        deviceName: null, // Reset dependent values
      };
      return { ...prev, device: updatedDevices };
    });
  };

  const handleDeviceChange = (index, selectedDevice) => {
    setDeviceId(selectedDevice.value);
    setFormData((prev) => {
      const updatedDevices = [...prev.device];
      updatedDevices[index] = {
        ...updatedDevices[index],
        deviceName: selectedDevice,
      };
      return { ...prev, device: updatedDevices };
    });
  };
  const handleCustomerPaidChange = (index, customerPaid) => {
    setFormData((prev) => {
      const updatedDevices = [...prev.device];
      const amount = parseFloat(updatedDevices[index]?.amount) || 0;
      const parsedPaid = parseFloat(customerPaid) || 0;

      updatedDevices[index] = {
        ...updatedDevices[index],
        customerPaid: parsedPaid,
        remainingAmount: amount - parsedPaid,
      };

      return { ...prev, device: updatedDevices };
    });
  };

  const handleAmountChange = (index, amount) => {
    setFormData((prev) => {
      const updatedDevices = [...prev.device];
      const customerPaid = parseFloat(updatedDevices[index]?.customerPaid) || 0;
      const parsedAmount = parseFloat(amount) || 0;

      updatedDevices[index] = {
        ...updatedDevices[index],
        amount: parsedAmount,
        remainingAmount: parsedAmount - customerPaid,
      };

      return { ...prev, device: updatedDevices };
    });
  };

  const handlePaymentTypeChange = (index, paymentType) => {
    setFormData((prev) => {
      const updatedDevices = [...prev.device];
      updatedDevices[index] = {
        ...updatedDevices[index],
        paymentType: paymentType,
      };
      return { ...prev, device: updatedDevices };
    });
  };
  const addDevice = () => {
    setFormData((prev) => ({
      ...prev,
      device: [
        ...prev.device,
        {
          modelName: null,
          deviceName: null,
          paymentType: "",
          amount: "",
          customerPaid: "",
          remainingAmount: "",
          upload: "",
        },
      ],
    }));
  };
  //for account part
  const handlePaymentChange = (index, selectAccount) => {
    setPaymentId(selectAccount.value);
    setFormData((prev) => {
      const updatedPayments = [...prev.payment];
      updatedPayments[index] = {
        ...updatedPayments[index],
        paymentAccount: selectAccount,
      };
      return { ...prev, payment: updatedPayments };
    });
  };

  // const handlePaymentAmountChange = (index, selectAmount) => {
  //   setAdjustAmount(selectAmount);
  //   setFormData((prev) => {
  //     const updatedPayments = [...prev.payment];
  //     updatedPayments[index] = {
  //       ...updatedPayments[index],
  //       paymentAmount: selectAmount,
  //     };
  //     return { ...prev, payment: updatedPayments };
  //   });
  // };

  // const handlePaymentAmountChange = (index, selectAmount) => {
  //   const newAmount = Number(selectAmount) || 0;

  //   setAdjustAmount(newAmount);

  //   setFormData((prev) => {
  //     const updatedPayments = [...prev.payment];
  //     const previousAmount = Number(updatedPayments[index]?.paymentAmount) || 0;

  //     const updatedDevices = [...prev.device];
  //     const device = { ...updatedDevices[index] };

  //     const delta = newAmount - previousAmount; // change in payment

  //     device.customerPaid = (Number(device.customerPaid) || 0) + delta;
  //     device.remainingAmount = Math.max(
  //       (Number(device.remainingAmount) || 0) - delta,
  //       0
  //     );

  //     updatedPayments[index] = {
  //       ...updatedPayments[index],
  //       paymentAmount: newAmount,
  //     };

  //     updatedDevices[index] = device;

  //     return {
  //       ...prev,
  //       payment: updatedPayments,
  //       device: updatedDevices,
  //     };
  //   });
  // };

  //WITH OUT AN ID ==========

  // const handlePaymentAmountChange = (index, selectAmount) => {
  //   const newAmount = Number(selectAmount) || 0;

  //   setAdjustAmount(newAmount);

  //   setFormData((prev) => {
  //     const updatedPayments = [...prev.payment];
  //     const previousAmount = Number(updatedPayments[index]?.paymentAmount) || 0;

  //     const updatedDevices = [...prev.device];
  //     const device = { ...updatedDevices[index] };

  //     const amount = Number(device.amount) || 0;
  //     const customerPaid = Number(device.customerPaid) || 0;
  //     const remaining = Number(device.remainingAmount) || 0;

  //     const delta = newAmount - previousAmount;

  //     // ❌ Block input if user tries to pay more than remaining
  //     if (delta > remaining) {
  //       return prev; // Do not update
  //     }

  //     let newCustomerPaid = customerPaid + delta;
  //     let newRemainingAmount = amount - newCustomerPaid;

  //     // Safety bounds
  //     newCustomerPaid = Math.min(newCustomerPaid, amount);
  //     newRemainingAmount = Math.max(amount - newCustomerPaid, 0);

  //     updatedPayments[index] = {
  //       ...updatedPayments[index],
  //       paymentAmount: newAmount,
  //     };

  //     updatedDevices[index] = {
  //       ...device,
  //       customerPaid: newCustomerPaid,
  //       remainingAmount: newRemainingAmount,
  //     };

  //     return {
  //       ...prev,
  //       payment: updatedPayments,
  //       device: updatedDevices,
  //     };
  //   });
  // };

  //ONLY ONE PAYMENT MODE ANF METHOD

  const handlePaymentAmountChange = (index, selectAmount) => {
    const newAmount = Number(selectAmount) || 0;
    setAdjustAmount(newAmount);

    setFormData((prev) => {
      const updatedPayments = [...prev.payment];
      const previousAmount = Number(updatedPayments[index]?.paymentAmount) || 0;

      updatedPayments[index] = {
        ...updatedPayments[index],
        paymentAmount: newAmount,
      };

      // If no id (create mode), just update paymentAmount only
      if (stock) {
        return {
          ...prev,
          payment: updatedPayments,
        };
      }

      // Edit mode (id exists) — run full logic
      const updatedDevices = [...prev.device];
      const device = { ...updatedDevices[index] };

      const amount = Number(device.amount) || 0;
      const customerPaid = Number(device.customerPaid) || 0;
      const remaining = Number(device.remainingAmount) || 0;

      const delta = newAmount - previousAmount;

      // Prevent overpayment
      if (delta > remaining) {
        return prev; // skip update
      }

      let newCustomerPaid = customerPaid + delta;
      let newRemainingAmount = amount - newCustomerPaid;

      newCustomerPaid = Math.min(newCustomerPaid, amount);
      newRemainingAmount = Math.max(newRemainingAmount, 0);

      updatedDevices[index] = {
        ...device,
        customerPaid: newCustomerPaid,
        remainingAmount: newRemainingAmount,
      };

      return {
        ...prev,
        payment: updatedPayments,
        device: updatedDevices,
      };
    });
  };

  const addPayment = () => {
    setFormData((prev) => ({
      ...prev,
      payment: [
        ...(Array.isArray(prev.payment) ? prev.payment : []),
        { paymentAccount: null, paymentAmount: "" },
      ],
    }));
  };

  const removePayment = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      payment: prev.payment.filter((_, index) => index !== indexToRemove),
    }));
  };

  const removeDevice = (index) => {
    const updatedDeviceData = [...formData.device];
    updatedDeviceData.splice(index, 1);
    setFormData({ ...formData, device: updatedDeviceData });
  };

  const callApi = async () => {
    if (!id) return;

    try {
      let data;

      if (stock) {
        const response = await getOneStock(id);
        data = response?.data?.data;
        setFormData({
          stock: id,
          organization: {
            label: data?.organization?.organizationName || "",
            value: data?.organization?._id || "",
          },
          branch: {
            label: data?.branch?.branchName || "",
            value: data?.branch?._id || "",
          },
          device: [
            {
              modelName: {
                label: data?.modelName?.modelName || "",
                value: data?.modelName?._id || "",
              },
              deviceName: {
                label: data?.deviceName?.deviceName || "",
                value: data?.deviceName?._id || "",
              },

              totalAmount: data?.expenseAmount
                ? data?.totalAmount + data?.expenseAmount
                : data?.totalAmount || "N/A",
            },
          ],
          payment: [
            {
              paymentAccount: {
                label: data?.paymentAccount?.accountName || "",
                value: data?.paymentAccount?._id || "",
              },
              paymentAmount: data?.paymentAmount || "",
            },
          ],
        });
      } else {
        const response = await getOneSell(id);
        data = response.data.data;
        console.log(data);
        setFormData({
          organization: {
            label: data?.organization?.organizationName || "",
            value: data?.organization?._id || "",
          },
          branch: {
            label: data?.branch?.branchName || "",
            value: data?.branch?._id || "",
          },
          customerName: {
            label: data?.customerName?.customerName || "",
            value: data?.customerName?._id || "",
          },
          customerPhone: data?.customerPhone || "",

          device: [
            {
              modelName: {
                label: data?.modelName?.modelName || "",
                value: data?.modelName?._id || "",
              },
              deviceName: {
                label: data?.deviceName?.deviceName || "",
                value: data?.deviceName?._id || "",
              },
              paymentType: data?.paymentType,
              totalAmount: data?.stock.totalAmount,
              amount: data?.amount,
              customerPaid: data?.customerPaid,
              remainingAmount: data?.remainingAmount,
            },
          ],
          payment: [
            {
              paymentAccount: {
                label: data?.paymentAccount?.accountName || "",
                value: data?.paymentAccount?._id || "",
              },
              paymentAmount: data?.paymentAmount || "",
            },
          ],
        });
      }

      if (!data) {
        console.warn("No data found in response");
        return;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    callApi();
  }, []);

  const validateSellForm = () => {
    let newErrors = {
      device: [],
      payment: [],
    };

    // Validate top-level fields
    if (!formData.organization)
      newErrors.organization = errorMessage.organizationName;
    if (!formData.branch) newErrors.branch = errorMessage.branchName;
    if (!formData.customerName)
      newErrors.customerName = errorMessage.customerName;
    if (!formData.customerPhone) newErrors.customerPhone = errorMessage.mobile;

    // Validate customerPhone format
    if (formData.customerPhone && !/^\d+$/.test(formData.customerPhone)) {
      newErrors.customerPhone = formatMessage.customerPhone;
    } else if (formData.customerPhone && formData.customerPhone.length !== 10) {
      newErrors.customerPhone = lengthMessage.mobile;
    }

    // Validate devices
    if (Array.isArray(formData.device)) {
      formData.device.forEach((device, index) => {
        if (!newErrors.device) newErrors.device = [];
        if (!newErrors.device[index]) newErrors.device[index] = {};

        if (!device.modelName)
          newErrors.device[index].modelName = errorMessage.modelName;

        if (!device.deviceName)
          newErrors.device[index].deviceName = errorMessage.deviceName;

        if (!device.paymentType)
          newErrors.device[index].paymentType = errorMessage.paymentType;

        if (!device.amount)
          newErrors.device[index].amount = errorMessage.amount;

        if (!device.customerPaid)
          newErrors.device[index].customerPaid = errorMessage.customerPaid;
      });
    }

    // Validate payments
    if (Array.isArray(formData.payment)) {
      formData.payment.forEach((payment, paymentIndex) => {
        if (!newErrors.payment[paymentIndex])
          newErrors.payment[paymentIndex] = {};

        // if (!payment.paymentAccount) {
        //   newErrors.payment[paymentIndex].paymentAccount =
        //     errorMessage.paymentAccount;
        // }

       if (!payment.paymentAccount)
      newErrors.paymentAccount = errorMessage.paymentAccount;

        if (!payment.paymentAmount || isNaN(payment.paymentAmount)) {
          newErrors.payment[paymentIndex].paymentAmount =
            errorMessage.paymentAmount;
        } else if (payment.paymentAmount <= 0) {
          newErrors.payment[paymentIndex].paymentAmount =
            "Payment amount must be greater than 0.";
        }
      });
    }
    console.log("New Errors:", formData.payment.paymentAccount, newErrors);

    setErrors(newErrors);

    // Check if all error objects are empty
    const hasErrors = Object.values(newErrors).some((error) =>
      Array.isArray(error)
        ? error.some((item) => Object.keys(item || {}).length > 0)
        : error
    );

    return !hasErrors;
  };

  const handleSubmit = async () => {
    if (loading) return; // prevent multiple clicks

    if (!validateSellForm()) {
      return;
    }

    setLoading(true); // Start loading

    try {
      const formattedDevices = formData.device.map((deviceItem) => ({
        modelName: deviceItem.modelName?.value || null,
        deviceName: deviceItem.deviceName?.value || null,
        paymentType: deviceItem.paymentType || "",
        amount: deviceItem.amount || "",
        customerPaid: deviceItem.customerPaid || "",
        remainingAmount: deviceItem.remainingAmount || 0,
        upload: deviceItem.upload || "",
      }));

      const formattedPayment = formData.payment.map((paymentItem) => ({
        paymentAccount: paymentItem.paymentAccount?.value || null,
        paymentAmount: paymentItem.paymentAmount || 0,
      }));

      const payload = {
        stock: id || null,
        organization: formData.organization?.value || null,
        branch: formData.branch?.value || null,
        customerName: formData.customerName?.value || null,
        customerPhone: formData.customerPhone,
        device: formattedDevices,
        payment: formattedPayment,
      };

      if (stock) {
        await createSell(payload);
      } else if (id) {
        await updateSell(payload, id);
      } else {
        await createSell(payload);
      }

      navigate(!stock ? "/customerLedgerPage" : "/sellPage");
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Box
      sx={{
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6c5ce7" }}>
        SELL DEVICE
      </Typography>
      {stock && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <OrgInput
              role="admin"
              onChange={handleOrganizationChange}
              value={formData.organization} // Now it's an object, not undefined
              error={errors.organization}
            />
          </Grid>
          <Grid item xs={6}>
            <OrgBranchInput
              role="admin"
              onChange={handleOrganizationBranchChange}
              value={formData.branch || null} // ✅ Ensure branch is always an object or null
              selectedOrganization={selectedOrganization}
              error={errors.branch}
            />
          </Grid>
          <Grid item xs={6}>
            <CustomerInput
              onChange={handleCustomerChange}
              value={formData.customerName}
              branchId={formData?.branch?.value}
              error={errors.customerName}
              field={"sell"}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              disabled
              type="number"
              fullWidth
              label="Phone Number"
              variant="outlined"
              name="customerPhone"
              value={formData.customerPhone || ""}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>
      )}

      {formData?.device?.map((item, deviceIndex) => (
        <Box
          key={`device-${deviceIndex}`}
          mt={3}
          p={2}
          sx={{ border: "1px solid #ccc", borderRadius: 2 }}
        >
          {id ? (
            ""
          ) : (
            <>
              <Grid container spacing={2} mt={1}>
                <Grid item sx={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={addDevice}
                  >
                    Add Device
                  </Button>
                </Grid>
                {deviceIndex > 0 && (
                  <Grid item sx={2}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => removeDevice(deviceIndex)}
                    >
                      Remove Device
                    </Button>
                  </Grid>
                )}
              </Grid>
            </>
          )}

          <Grid container spacing={2} mt={1}>
            {stock && (
              <>
                <Grid item xs={6}>
                  <ModelInput
                    onChange={(selectedModel) =>
                      handleModelChange(deviceIndex, selectedModel)
                    }
                    value={formData.device[deviceIndex]?.modelName}
                    branchId={formData?.branch?.value}
                    error={
                      (errors &&
                        errors.device &&
                        errors.device[deviceIndex] &&
                        errors.device[deviceIndex].modelName) ||
                      ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <DeviceInput
                    onChange={(selectedDevice) =>
                      handleDeviceChange(deviceIndex, selectedDevice)
                    }
                    value={formData.device[deviceIndex]?.deviceName}
                    modelId={modelId}
                    error={
                      (errors &&
                        errors.device &&
                        errors.device[deviceIndex] &&
                        errors.device[deviceIndex].deviceName) ||
                      ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={!!errors.paymentType}
                    required
                  >
                    <InputLabel id="paymentType-label">Payment Type</InputLabel>
                    <Select
                      labelId="paymentType-label"
                      id="paymentType"
                      name="paymentType"
                      value={formData.device?.[deviceIndex]?.paymentType || ""}
                      onChange={(e) =>
                        handlePaymentTypeChange(deviceIndex, e.target.value)
                      }
                      label="paymentType"
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Cheque">Cheque</MenuItem>
                      <MenuItem value="Upi">Upi</MenuItem>
                      <MenuItem value="Neft">Neft</MenuItem>
                      <MenuItem value="Card">Card</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    disabled
                    fullWidth
                    label="Stock Amount"
                    name="totalAmount"
                    value={formData.device?.[deviceIndex]?.totalAmount || ""}
                    type="number"
                    error={
                      (errors &&
                        errors.device &&
                        errors.device[deviceIndex] &&
                        errors.device[deviceIndex].totalAmount) ||
                      ""
                    }
                    helperText={errors.device?.[deviceIndex]?.totalAmount || ""}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                value={formData.device?.[deviceIndex]?.amount || ""}
                type="number"
                onChange={(e) =>
                  handleAmountChange(deviceIndex, e.target.value)
                }
                error={
                  (errors &&
                    errors.device &&
                    errors.device[deviceIndex] &&
                    errors.device[deviceIndex].amount) ||
                  ""
                }
                helperText={
                  (errors &&
                    errors.device &&
                    errors.device[deviceIndex] &&
                    errors.device[deviceIndex].amount) ||
                  ""
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="customerPaid"
                name="customerPaid"
                value={formData.device?.[deviceIndex]?.customerPaid || ""}
                type="number"
                onChange={(e) =>
                  handleCustomerPaidChange(deviceIndex, e.target.value)
                }
                error={
                  (errors &&
                    errors.device &&
                    errors.device[deviceIndex] &&
                    errors.device[deviceIndex].customerPaid) ||
                  ""
                }
                helperText={
                  (errors &&
                    errors.device &&
                    errors.device[deviceIndex] &&
                    errors.device[deviceIndex].customerPaid) ||
                  ""
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Remaining Amount"
                name="remainingAmount"
                value={
                  (formData.device?.[deviceIndex]?.amount || 0) -
                  (formData.device?.[deviceIndex]?.customerPaid || 0)
                }
                type="number"
                InputProps={{
                  readOnly: !id,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      ))}
      <Box mt={3} p={2} sx={{ border: "1px solid #ccc", borderRadius: 2 }}>
        {formData.payment.map((payment, paymentIndex) => (
          <>
            <Grid container spacing={2} mt={1}>
              {stock && (
                <Grid item sx={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={addPayment}
                  >
                    Add Payment
                  </Button>
                </Grid>
              )}
              {paymentIndex > 0 && (
                <Grid item sx={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removePayment(paymentIndex)}
                  >
                    Remove Payment
                  </Button>
                </Grid>
              )}
            </Grid>

            <Grid
              container
              spacing={2}
              key={payment.id}
              alignItems="center"
              sx={{ marginTop: ".5rem" }}
            >
              <Grid item xs={6}>
                <PaymentInput
                  label="Payment Account"
                  value={
                    formData.payment?.[paymentIndex]?.paymentAccount || null
                  }
                  branchId={formData?.branch?.value}
                  onChange={(selectAccount) =>
                    handlePaymentChange(paymentIndex, selectAccount)
                  }
                  error={
                    !!(
                      errors &&
                      errors.payment &&
                      errors.payment[paymentIndex] &&
                      errors.payment[paymentIndex].paymentAccount
                    ) || ""
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Payment Amount"
                  value={formData.payment?.[paymentIndex]?.paymentAmount || ""}
                  onChange={(e) =>
                    handlePaymentAmountChange(paymentIndex, e.target.value)
                  }
                  type="number"
                  error={
                    (errors &&
                      errors.payment &&
                      errors.payment[paymentIndex] &&
                      errors.payment[paymentIndex].paymentAmount) ||
                    ""
                  }
                  helperText={
                    (errors &&
                      errors.payment &&
                      errors.payment[paymentIndex] &&
                      errors.payment[paymentIndex].paymentAmount) ||
                    ""
                  }
                  disabled={!stock && formData.device[0]?.remainingAmount == 0}
                />
              </Grid>
            </Grid>
          </>
        ))}
      </Box>

      <Box mt={2} display="flex" justifyContent="end" gap={2}>
        <Button
          variant="outlined"
          color="error"
          component={Link}
          to={!stock ? "/customerLedgerPage" : "/sellPage"}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={
            (!sellCreateFromStock &&
              formData.payment?.[0]?.paymentAmount == 0) ||
            loading
          }
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default SellForm;
