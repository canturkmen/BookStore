import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Comments from "../components/Comments";
import CommentForm from "../components/CommentForm";

// Mock the fetch function to return sample data
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ reviews: [] }),
  })
);

describe("Comments", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("renders Comments component", async () => {
    render(<Comments bookId="1" />);

    // Check if the component renders with the correct title
    expect(screen.getByText(/Comments \(0\)/)).toBeInTheDocument();

    // Wait for the useEffect hook to fetch comments
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });
});

describe("CommentForm", () => {
  test("renders CommentForm component", () => {
    const handleSubmitMock = jest.fn();
    render(<CommentForm submitLabel="Write" handleSubmit={handleSubmitMock} />);

    expect(screen.getByText("Write")).toBeInTheDocument();
  });

  test("calls handleSubmit on form submission", () => {
    const handleSubmitMock = jest.fn();
    render(<CommentForm submitLabel="Write" handleSubmit={handleSubmitMock} />);

    fireEvent.submit(screen.getByRole("button", { name: "Write" }));

    expect(handleSubmitMock).toHaveBeenCalledTimes(1);
  });

  test("entering text and submitting calls handleSubmit with correct data", () => {
    const handleSubmitMock = jest.fn();
    render(<CommentForm submitLabel="Write" handleSubmit={handleSubmitMock} />);

    userEvent.type(screen.getByRole("textbox"), "This is a test comment");
    fireEvent.submit(screen.getByRole("button", { name: "Write" }));

    expect(handleSubmitMock).toHaveBeenCalledWith("This is a test comment");
  });
});
