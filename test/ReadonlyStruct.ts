import { pick, pickFrom, omit, merge } from "../src/ReadonlyStruct"
import { pipe } from "fp-ts/function"

describe("ReadonlyStruct", () => {
  describe("pick", () => {
    type Thing = { name: string; age: number; email?: string }
    const x: Thing = { name: "Hodor", age: 123 }
    const y: Thing = { name: "Hodor", age: 123, email: "foo@bar.com" }

    it("picks no keys", () => {
      expect(pipe(x, pick([]))).toEqual({})
    })

    it("picks individual keys", () => {
      expect(pipe(x, pick(["name"]))).toEqual({ name: "Hodor" })
      expect(pipe(x, pick(["age"]))).toEqual({ age: 123 })
      expect(pipe(x, pick(["email"]))).toStrictEqual({})
      expect(pipe(y, pick(["email"]))).toStrictEqual({ email: "foo@bar.com" })
    })

    it("picks multiple keys", () => {
      expect(pipe(x, pick(["name", "age", "email"]))).toStrictEqual(x)
      expect(pipe(y, pick(["name", "age", "email"]))).toStrictEqual(y)
    })
  })

  describe("pickFrom", () => {
    type Thing = { name: string; age: number }
    const x: Thing = { name: "Hodor", age: 123 }
    const f = pickFrom<Thing>()

    it("picks no keys", () => {
      expect(f([])(x)).toEqual({})
    })

    it("picks individual keys", () => {
      expect(f(["name"])(x)).toEqual({ name: "Hodor" })
      expect(f(["age"])(x)).toEqual({ age: 123 })
    })

    it("picks multiple keys", () => {
      expect(f(["name", "age"])(x)).toEqual(x)
    })
  })

  describe("omit", () => {
    type Thing = { name: string; id: string; foo: string }

    it("omits multiple keys", () => {
      const before: Thing = { name: "Ragnor", id: "789", foo: "Bar" }
      const after: Omit<Thing, "id" | "foo"> = { name: "Ragnor" }

      expect(omit(["id", "foo"])(before)).toEqual(after)
    })

    it("typechecks missing keys", () => {
      const before: Thing = { name: "Ragnor", id: "789", foo: "Bar" }
      const after: Omit<Thing, "id"> = { name: "Ragnor", foo: "Bar" }

      expect(omit(["id", "bar"])(before)).toEqual(after)
    })
  })

  describe("merge", () => {
    const f = merge

    it("merges, prioritising the second input", () => {
      expect(f({ a: 1, b: 2 })({ b: "two", c: true })).toEqual({
        a: 1,
        b: "two",
        c: true,
      })
    })
  })
})
