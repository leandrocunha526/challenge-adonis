import vine from '@vinejs/vine'

/**
 * Validates the user's registration data
 */
export const createUserValidator = vine.compile(
  vine.object({
    nome: vine.string().trim().minLength(3).maxLength(255).optional(),
    email: vine.string().email().trim().minLength(3).maxLength(255),
    password: vine.string().minLength(6).maxLength(255)
  })
)

/**
 * Validates the user's update data
 */
export const updateUserValidator = vine.compile(
  vine.object({
    nome: vine.string().trim().minLength(3).maxLength(255).optional(),
    email: vine.string().email().trim().minLength(3).maxLength(255),
    password: vine.string().minLength(6).maxLength(255)
  })
)

/**
 * Validates the user's update data
 */
export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().minLength(3).maxLength(255),
    password: vine.string().minLength(6).maxLength(255)
  })
)
