import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import axios from "axios";
import { handleNext } from "../../../Store/Slices";
import {
  LoginInformation,
  DetailsComponent,
  ContactInformation,
} from "./Steps";

const loginInfoSchema = Yup.object().shape({
  logo: Yup.string().required("حقل الشعار مطلوب"),
  gymName: Yup.string().required("حقل الاسم مطلوب"),
  email: Yup.string()
    .email(" البريد الالكتروني غير صحيح")
    .required("حقل البريد الالكتروني مطلوب"),
  password: Yup.string()
    .min(8, "كلمة المرور على الاقل 8 احرف")
    .required("حقل كلمة المرور مطلوب"),
});

const SignupSchema = Yup.object().shape({
  city: Yup.string().required("حقل المدينة مطلوب"),
  phone: Yup.string()
    .length(10, "رقم الهاتف غير صحيح")
    .required("حقل رقم الهاتف مطلوب"),
});
const detailsSchema = Yup.object().shape({
  features: Yup.array().min(1, "حقل المزايا مطلوب"),
  typeGender: Yup.string().required("حقل الفئة مطلوب"),
  monthlyPrice: Yup.number()
    .moreThan(1, "يرجى إدخال قيمة أعلى من 1")
    .required("قيمة اشتراك الشهر مطلوب"),
  sixMonthPrice: Yup.number()
    .moreThan(1, "يرجى إدخال قيمة أعلى من 1")
    .required("قيمة اشتراك الستة أشهر مطلوب"),
});

export default function BodyStepper() {
  const [formtest, setFormtest] = useState({});

  const registerGym = async (gym) => {
    try {
      const register = await axios.post("/api/v1/gyms/register", gym);
      console.log(register);
    } catch (err) {
      console.log(err, "error");
    }
  };

  const dispatch = useDispatch();

  const activeStep = useSelector(({ stepper }) => stepper.activeStep);

  const loginInformationForm = useFormik({
    initialValues: {
      logo: "",
      gymName: "",
      email: "",
      password: "",
    },
    validationSchema: loginInfoSchema,
    onSubmit: (values) => {
      setFormtest(Object.assign(formtest, values));
      dispatch(handleNext(values));
    },
  });

  const contactForm = useFormik({
    initialValues: {
      city: "غزة",
      phone: "",
      description: "",
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      setFormtest(Object.assign(formtest, values));
      dispatch(handleNext());
    },
  });
  const detailsForm = useFormik({
    initialValues: {
      features: [],
      typeGender: "",
      monthlyPrice: 0,
      sixMonthPrice: 0,
      fulltime: false,
    },
    validationSchema: detailsSchema,
    onSubmit: (values) => {
      setFormtest(Object.assign(formtest, values));
      registerGym(formtest);
    },
  });
  let StepComponent;
  switch (activeStep) {
    case 1:
      StepComponent = <ContactInformation contactForm={contactForm} />;
      break;
    case 2:
      StepComponent = <DetailsComponent detailsForm={detailsForm} />;
      break;
    default:
      StepComponent = (
        <LoginInformation loginInformationForm={loginInformationForm} />
      );
  }

  return StepComponent;
}
