import { expect } from "chai"
import Router from "./index.ts"

describe("Проверяем переходы у Роута", () => {
    const router = Router.getInstance()

    describe("Переходы на новую страницу", () => {
        it("Переход на новую страницу должен менять состояние сущности history", () => {
            router.go("/login")
            router.go("/register")

            expect(window.history.length).to.eq(3)
        })

        it("Переход на новую страницу: текущее состояние", () => {
            expect(window.location.pathname).to.eq("/register")
        })
    })

    describe("Переходы назад", () => {
        it("Переход назад: текущее состояние", async () => {
            router.back()

            const res = await new Promise((resolve) => {
                window.onpopstate = () => {
                    resolve(window.location.pathname)
                }
            })

            expect(res).to.eq("/login")
        })
    })

    describe("Переходы вперед", () => {
        it("Переход вперед: текущее состояние", async () => {
            router.forward()

            const res = await new Promise((resolve) => {
                window.onpopstate = () => {
                    resolve(window.location.pathname)
                }
            })

            expect(res).to.eq("/register")
        })
    })
})
