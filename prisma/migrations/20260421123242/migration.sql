-- CreateTable
CREATE TABLE "anual_analysis" (
    "anual_analysis_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6),
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "delivered" INTEGER NOT NULL DEFAULT 0,
    "not_delivered" INTEGER NOT NULL DEFAULT 0,
    "updated_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anual_analysis_pkey" PRIMARY KEY ("anual_analysis_uuid")
);

-- CreateTable
CREATE TABLE "assistants_po_register" (
    "assistants_po_registers_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "delivered" BOOLEAN NOT NULL DEFAULT false,
    "delivered_at" DATE,
    "assistant_as" TEXT NOT NULL,
    "production_order_uuid" UUID NOT NULL,
    "assistant_uuid" UUID NOT NULL,

    CONSTRAINT "assistants_po_register_pkey" PRIMARY KEY ("assistants_po_registers_uuid")
);

-- CreateTable
CREATE TABLE "employees" (
    "employee_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "employee_type" TEXT NOT NULL,
    "delivered_activities_quantity" INTEGER NOT NULL DEFAULT 0,
    "not_delivered_activities_quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("employee_uuid")
);

-- CreateTable
CREATE TABLE "goals" (
    "goal_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "goal_title" TEXT NOT NULL,
    "goal_description" TEXT,
    "goal_type" TEXT NOT NULL DEFAULT 'Geral',
    "goal_deadline" DATE NOT NULL,
    "goal_status" TEXT NOT NULL,
    "employee_goal" UUID,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("goal_uuid")
);

-- CreateTable
CREATE TABLE "in_out_stock" (
    "in_out_stock_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "in_quantity" INTEGER NOT NULL DEFAULT 0,
    "out_quantity" INTEGER NOT NULL DEFAULT 0,
    "updated_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "in_out_stock_pkey" PRIMARY KEY ("in_out_stock_uuid")
);

-- CreateTable
CREATE TABLE "materials" (
    "material_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "material_name" TEXT NOT NULL,
    "material_quantity" INTEGER,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("material_uuid")
);

-- CreateTable
CREATE TABLE "order_items" (
    "order_item_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" INTEGER NOT NULL,
    "product_uuid" UUID NOT NULL,
    "order_uuid" UUID NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("order_item_uuid")
);

-- CreateTable
CREATE TABLE "orders" (
    "order_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_status" TEXT NOT NULL DEFAULT 'Ainda não confirmado',
    "order_description" TEXT,
    "delivery_observation" TEXT,
    "order_title" TEXT NOT NULL,
    "order_deadline" DATE NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_uuid")
);

-- CreateTable
CREATE TABLE "production_order" (
    "production_order_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "production_order_title" TEXT NOT NULL,
    "production_order_description" TEXT,
    "production_order_deadline" DATE NOT NULL,
    "production_order_status" TEXT NOT NULL DEFAULT 'Pendente',
    "product_quantity" INTEGER NOT NULL DEFAULT 0,
    "delivered_at" DATE NOT NULL,
    "delivery_observation" TEXT,
    "delivered_product_quantity" INTEGER NOT NULL DEFAULT 0,
    "stock_validation" BOOLEAN NOT NULL DEFAULT false,
    "order_uuid" UUID NOT NULL,
    "cut_assistant" UUID,
    "fold_assistant" UUID,
    "finishing_assistant" UUID,
    "paint_assistant" UUID,
    "employee_uuid" UUID,
    "supervisor_uuid" UUID,

    CONSTRAINT "production_order_pkey" PRIMARY KEY ("production_order_uuid")
);

-- CreateTable
CREATE TABLE "products" (
    "product_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "product_type" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "features" TEXT[],
    "acronym" TEXT,
    "composition" JSONB,
    "stock_quantity" INTEGER DEFAULT 0,

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_uuid")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "refresh_token_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT NOT NULL,
    "expires_at" DATE NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "user_uuid" UUID NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("refresh_token_uuid")
);

-- CreateTable
CREATE TABLE "stock_updates" (
    "stock_updates_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_quantity_title" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "date" DATE,

    CONSTRAINT "stock_updates_pkey" PRIMARY KEY ("stock_updates_uuid")
);

-- CreateTable
CREATE TABLE "users" (
    "user_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "user_type" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- AddForeignKey
ALTER TABLE "assistants_po_register" ADD CONSTRAINT "assistants_po_register_assistant_uuid_fkey" FOREIGN KEY ("assistant_uuid") REFERENCES "employees"("employee_uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assistants_po_register" ADD CONSTRAINT "assistants_po_register_production_order_uuid_fkey" FOREIGN KEY ("production_order_uuid") REFERENCES "production_order"("production_order_uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_employee_goal_fkey" FOREIGN KEY ("employee_goal") REFERENCES "employees"("employee_uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_uuid_fkey" FOREIGN KEY ("order_uuid") REFERENCES "orders"("order_uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_uuid_fkey" FOREIGN KEY ("product_uuid") REFERENCES "products"("product_uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_order" ADD CONSTRAINT "production_order_cut_assistant_fkey" FOREIGN KEY ("cut_assistant") REFERENCES "employees"("employee_uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_order" ADD CONSTRAINT "production_order_employee_uuid_fkey" FOREIGN KEY ("employee_uuid") REFERENCES "employees"("employee_uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_order" ADD CONSTRAINT "production_order_finishing_assistant_fkey" FOREIGN KEY ("finishing_assistant") REFERENCES "employees"("employee_uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_order" ADD CONSTRAINT "production_order_fold_assistant_fkey" FOREIGN KEY ("fold_assistant") REFERENCES "employees"("employee_uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_order" ADD CONSTRAINT "production_order_order_uuid_fkey" FOREIGN KEY ("order_uuid") REFERENCES "orders"("order_uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_order" ADD CONSTRAINT "production_order_paint_assistant_fkey" FOREIGN KEY ("paint_assistant") REFERENCES "employees"("employee_uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_order" ADD CONSTRAINT "production_order_supervisor_uuid_fkey" FOREIGN KEY ("supervisor_uuid") REFERENCES "users"("user_uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("user_uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;
