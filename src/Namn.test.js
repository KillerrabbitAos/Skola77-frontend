import React from "react";
import { render, fireEvent } from "@testing-library/react";
import NamnRuta from "./Namn";

describe("NamnRuta Component", () => {
    const mockSetNamn = jest.fn();
    const namn = "Test Name";
    const index = 0;
    const allaNamn = ["Test Name", "Another Name"];

    it("should render with initial name", () => {
        const { getByDisplayValue } = render(
            <NamnRuta namn={namn} setNamn={mockSetNamn} index={index} allaNamn={allaNamn} />
        );
        expect(getByDisplayValue(namn)).toBeInTheDocument();
    });

    it("should update name on change", () => {
        const { getByDisplayValue } = render(
            <NamnRuta namn={namn} setNamn={mockSetNamn} index={index} allaNamn={allaNamn} />
        );
        const input = getByDisplayValue(namn);
        fireEvent.change(input, { target: { value: "New Name" } });
        expect(input.value).toBe("New Name");
    });

    it("should call setNamn on blur", () => {
        const { getByDisplayValue } = render(
            <NamnRuta namn={namn} setNamn={mockSetNamn} index={index} allaNamn={allaNamn} />
        );
        const input = getByDisplayValue(namn);
        fireEvent.change(input, { target: { value: "New Name" } });
        fireEvent.blur(input);
        expect(mockSetNamn).toHaveBeenCalledWith("New Name", index);
    });

    it("should set isFocused to true on focus", () => {
        const { getByDisplayValue } = render(
            <NamnRuta namn={namn} setNamn={mockSetNamn} index={index} allaNamn={allaNamn} />
        );
        const input = getByDisplayValue(namn);
        fireEvent.focus(input);
        expect(input.className).toContain("w-full");
    });

    it("should set isFocused to false on blur", () => {
        const { getByDisplayValue } = render(
            <NamnRuta namn={namn} setNamn={mockSetNamn} index={index} allaNamn={allaNamn} />
        );
        const input = getByDisplayValue(namn);
        fireEvent.focus(input);
        fireEvent.blur(input);
        expect(input.className).toContain("truncate");
    });

    it("should update currentName when allaNamn changes", () => {
        const { getByDisplayValue, rerender } = render(
            <NamnRuta namn={namn} setNamn={mockSetNamn} index={index} allaNamn={allaNamn} />
        );
        const newAllaNamn = ["Updated Name", "Another Name"];
        rerender(<NamnRuta namn={namn} setNamn={mockSetNamn} index={index} allaNamn={newAllaNamn} />);
        expect(getByDisplayValue("Updated Name")).toBeInTheDocument();
    });
});