"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function NoticeFilter({ locale }: { locale: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [title, setTitle] = useState(searchParams.get("title") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [fromDate, setFromDate] = useState(searchParams.get("fromDate") || "");
    const [toDate, setToDate] = useState(searchParams.get("toDate") || "");

    const labels = {
        title: locale === "ne" ? "शीर्षक" : "Title",
        category: locale === "ne" ? "समाचार कोटि" : "News Category",
        from: locale === "ne" ? "मिति देखि" : "From Date",
        to: locale === "ne" ? "मिति सम्म" : "To Date",
        search: locale === "ne" ? "खोज्नुहोस्" : "Search",
        reset: locale === "ne" ? "रिसेट" : "Reset",
        all: locale === "ne" ? "सूचना" : "Notice",
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (title) params.set("title", title); else params.delete("title");
        if (category) params.set("category", category); else params.delete("category");
        if (fromDate) params.set("fromDate", fromDate); else params.delete("fromDate");
        if (toDate) params.set("toDate", toDate); else params.delete("toDate");
        params.delete("page");
        router.push(`/notices?${params.toString()}`);
    };

    const handleReset = () => {
        setTitle("");
        setCategory("");
        setFromDate("");
        setToDate("");
        router.push("/notices");
    };

    return (
        <form onSubmit={handleSearch} className="filter-section">
            <div className="filter-grid">
                <div className="filter-group">
                    <label className="filter-label">{labels.title}</label>
                    <input
                        type="text"
                        className="filter-input"
                        placeholder={labels.title}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label className="filter-label">{labels.category}</label>
                    <select
                        className="filter-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">{labels.all}</option>
                        {/* Add other categories if applicable */}
                    </select>
                </div>
                <div className="filter-group">
                    <label className="filter-label">{labels.from}</label>
                    <div className="date-input-wrap">
                        <input
                            type="date"
                            className="filter-input"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                        {fromDate && (
                            <button type="button" className="clear-date-btn" onClick={() => setFromDate("")}>
                                X
                            </button>
                        )}
                    </div>
                </div>
                <div className="filter-group">
                    <label className="filter-label">{labels.to}</label>
                    <div className="date-input-wrap">
                        <input
                            type="date"
                            className="filter-input"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                        {toDate && (
                            <button type="button" className="clear-date-btn" onClick={() => setToDate("")}>
                                X
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="filter-actions">
                <button type="submit" className="btn-search">{labels.search}</button>
                <button type="button" className="btn-reset" onClick={handleReset}>{labels.reset}</button>
            </div>
        </form>
    );
}
