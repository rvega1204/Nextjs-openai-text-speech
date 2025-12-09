"use client";
import { useFormik } from "formik";
import React, { useRef, useState } from "react";
import * as Yup from "yup";

/**
 * Speech component for text-to-speech functionality.
 * Allows users to input text and convert it into speech audio.
 */
const Speech = () => {
  const [loading, setLoading] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const audioRef = useRef(null);
  const [error, setError] = useState("");

  /**
   * Handles the text-to-speech conversion process.
   * @param {string} text - The text to be converted to speech.
   */
  const handleSearch = async (text) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new Error(
          `Failed to fetch speech: ${response.status} - ${
            errorData.message || response.statusText
          }`
        );
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
    } catch (error) {
      setError(error.message);
      setAudioURL("");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculates the word count of the input text.
   * @param {string} text - The text to count words in.
   * @returns {number} The word count of the text.
   */
  const countWords = (text) => {
    return text?.length ? text.trim().split(/\s+/).length : 0;
  };

  /**
   * Initializes the formik form for text input and submission.
   * @returns {Object} The formik form configuration.
   */
  const formik = useFormik({
    initialValues: {
      text: "",
    },
    validationSchema: Yup.object({
      text: Yup.string()
        .required("Text is Required")
        .min(5, "Must be at least 5 characters long")
        .max(5000, "Cannot exceed 5000 characters"), // Enforce a maximum limit for characters
    }),
    onSubmit: (values) => {
      handleSearch(values.text);
    },
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-2xl w-full p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-xl font-semibold text-gray-800">
          Text to Speech Converter
        </h1>
        <p className="text-gray-600 mt-2">
          Enter your text below to convert it into speech.
        </p>
        <form className="mt-4" onSubmit={formik.handleSubmit}>
          <div>
            <textarea
              {...formik.getFieldProps("text")}
              name="text"
              placeholder="Enter text here..."
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 transition-colors"
              rows="4"
              maxLength="5000"
            />

            {/* error */}
            {formik.touched.text && formik.errors.text ? (
              <div className="text-red-500 text-sm">{formik.errors.text}</div>
            ) : null}
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            {/* words count */}
            <div>
              Words: {countWords(formik.values.text)} / Characters:{""}{" "}
              {formik.values.text.length} /5000
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !formik.isValid || formik.isSubmitting}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Play Speech"}
          </button>
        </form>
        {/* Display audio */}
        {audioURL && (
          <div className="mt-4">
            <audio ref={audioRef} src={audioURL} controls />
          </div>
        )}
      </div>
    </div>
  );
};

export default Speech;
