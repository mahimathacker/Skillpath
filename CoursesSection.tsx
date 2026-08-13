import { useEffect, useState } from "react"

type Course = {
    courseName: string
    description: string
    mainCategory: string
    pricePaise: number
    priceUsdCents: number
    refundable: boolean
}

type CountryCode = "IN" | "US"

type CountryResponse = {
    country_code: CountryCode
}

const BASE_URL = "https://syncsphere-hiv6.onrender.com"

function isCourse(value: unknown): value is Course {
    if (typeof value !== "object" || value === null) {
        return false
    }

    const course = value as Record<string, unknown>

    return (
        typeof course.courseName === "string" &&
        typeof course.description === "string" &&
        typeof course.mainCategory === "string" &&
        typeof course.pricePaise === "number" &&
        Number.isFinite(course.pricePaise) &&
        typeof course.priceUsdCents === "number" &&
        Number.isFinite(course.priceUsdCents) &&
        typeof course.refundable === "boolean"
    )
}

function isCourseArray(value: unknown): value is Course[] {
    return Array.isArray(value) && value.every(isCourse)
}

function isCountryResponse(value: unknown): value is CountryResponse {
    if (typeof value !== "object" || value === null) {
        return false
    }

    const response = value as Record<string, unknown>

    return response.country_code === "IN" || response.country_code === "US"
}

async function fetchCourses(): Promise<Course[]> {
    const response = await fetch(`${BASE_URL}/assignment/course-data`, {
        method: "GET",
    })

    if (!response.ok) {
        throw new Error(`Course request failed with status ${response.status}`)
    }

    const data: unknown = await response.json()

    if (!isCourseArray(data)) {
        throw new Error("Course response has an unexpected format")
    }

    return data
}

async function fetchCountry(): Promise<CountryCode> {
    const response = await fetch(`${BASE_URL}/assignment/country-code`, {
        method: "GET",
    })

    if (!response.ok) {
        throw new Error(`Country request failed with status ${response.status}`)
    }

    const data: unknown = await response.json()

    if (!isCountryResponse(data)) {
        throw new Error("Country response has an unexpected format")
    }

    return data.country_code
}

function formatPrice(course: Course, country: CountryCode): string {
    if (country === "IN") {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(course.pricePaise / 100)
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(course.priceUsdCents / 100)
}

export default function CoursesSection() {
    const [courses, setCourses] = useState<Course[]>([])
    const [country, setCountry] = useState<CountryCode | null>(null)
    const [coursesError, setCoursesError] = useState(false)
    const [countryError, setCountryError] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            const [coursesResult, countryResult] = await Promise.allSettled([
                fetchCourses(),
                fetchCountry(),
            ])

            if (coursesResult.status === "fulfilled") {
                setCourses(coursesResult.value)
            } else {
                setCoursesError(true)
            }

            if (countryResult.status === "fulfilled") {
                setCountry(countryResult.value)
            } else {
                setCountryError(true)
            }

            setLoading(false)
        }

        loadData()
    }, [])

    if (loading) {
        return (
            <section style={styles.section}>
                <style>{`
                    @keyframes skillpath-spin {
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}</style>
                <div style={styles.spinner} />
                <p style={styles.message}>Loading courses...</p>
            </section>
        )
    }

    if (coursesError) {
        return (
            <section style={styles.section}>
                <div style={styles.errorBox}>
                    <h2 style={styles.errorTitle}>We couldn't load the courses.</h2>
                    <p style={styles.errorMessage}>Please try again later.</p>
                </div>
            </section>
        )
    }

    if (courses.length === 0) {
        return (
            <section style={styles.section}>
                <h2 style={styles.emptyTitle}>No courses available yet.</h2>
                <p style={styles.emptyMessage}>Please check back soon.</p>
            </section>
        )
    }

    return (
        <section style={styles.contentSection}>
            <h2 style={styles.sectionHeading}>Explore Our Courses</h2>

            <div style={styles.courseGrid}>
                {courses.map((course, index) => (
                    <article
                        key={`${course.courseName}-${index}`}
                        style={styles.card}
                    >
                        <span style={styles.category}>
                            {course.mainCategory}
                        </span>
                        <h3 style={styles.courseName}>{course.courseName}</h3>
                        <p style={styles.description}>{course.description}</p>
                        <p style={styles.price}>
                            {countryError || country === null
                                ? "Pricing unavailable"
                                : formatPrice(course, country)}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    )
}

const styles = {
    section: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        backgroundColor: "#FFFFFF",
        fontFamily: "Inter, sans-serif",
    },
    spinner: {
        width: "28px",
        height: "28px",
        border: "3px solid #E9E2F3",
        borderTopColor: "#7C3AED",
        borderRadius: "50%",
        animation: "skillpath-spin 0.8s linear infinite",
    },
    errorBox: {
        padding: "24px",
        borderRadius: "12px",
        backgroundColor: "#FEF3F2",
        textAlign: "center",
    },
    errorTitle: {
        margin: 0,
        color: "#B42318",
        fontSize: "20px",
    },
    errorMessage: {
        margin: "8px 0 0",
        color: "#6B6478",
        fontSize: "16px",
    },
    emptyTitle: {
        margin: 0,
        color: "#1F1633",
        fontSize: "20px",
    },
    emptyMessage: {
        margin: 0,
        color: "#6B6478",
        fontSize: "16px",
    },
    contentSection: {
        width: "100%",
        minHeight: "100%",
        boxSizing: "border-box",
        padding: "64px 40px",
        backgroundColor: "#FFFFFF",
        fontFamily: "Inter, sans-serif",
    },
    sectionHeading: {
        margin: "0 0 32px",
        color: "#1F1633",
        fontSize: "36px",
        textAlign: "center",
    },
    courseGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "24px",
        width: "100%",
        maxWidth: "1120px",
        margin: "0 auto",
    },
    card: {
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        border: "1px solid #E9E2F3",
        borderRadius: "14px",
        backgroundColor: "#FFFFFF",
    },
    category: {
        alignSelf: "flex-start",
        padding: "6px 10px",
        borderRadius: "999px",
        backgroundColor: "#F3E8FF",
        color: "#7C3AED",
        fontSize: "13px",
        fontWeight: 600,
    },
    courseName: {
        margin: "18px 0 10px",
        color: "#1F1633",
        fontSize: "22px",
        lineHeight: 1.3,
    },
    description: {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 2,
        overflow: "hidden",
        margin: 0,
        color: "#6B6478",
        fontSize: "15px",
        lineHeight: 1.6,
    },
    price: {
        margin: "20px 0 0",
        color: "#7C3AED",
        fontSize: "20px",
        fontWeight: 700,
    },
    message: {
        margin: 0,
        color: "#1F1633",
        fontSize: "18px",
    },
}
