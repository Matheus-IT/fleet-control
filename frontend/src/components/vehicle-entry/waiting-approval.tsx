import React from "react";
import { VehicleEntryRegistryDetail, VehiclePart } from "@/types/api";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { Car, Wrench, AlertCircle, User, Building2, Users } from "lucide-react";
import { formatCurrency } from "@/utils/currency";

export default function WaitingApproval({
  lastEntryData,
}: {
  lastEntryData: VehicleEntryRegistryDetail;
}) {
  const vehicle = lastEntryData.vehicle;

  const calculateTotal = (parts: VehiclePart[]) => {
    return parts.reduce(
      (sum, part) => sum + part.unit_value * part.quantity,
      0
    );
  };

  return (
    <main className="container mx-auto py-6 px-4 max-w-2xl">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-start gap-3 bg-orange-50">
          <div className="flex items-center gap-2 text-orange-600">
            <AlertCircle className="w-6 h-6" />
            <h1 className="text-xl font-semibold">Aguardando aprovação</h1>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-6">
            {/* Vehicle Details Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Car className="w-5 h-5" />
                <span className="font-medium">Detalhes do Veículo</span>
              </div>
              <div className="pl-7 space-y-2">
                <p className="text-base">
                  <span className="text-gray-600">Modelo:</span>{" "}
                  <strong>{vehicle.model}</strong>
                </p>
                <p className="text-base">
                  <span className="text-gray-600">Placa:</span>{" "}
                  <strong>{vehicle.licence_plate}</strong>
                </p>
              </div>
            </div>

            {/* Problem Details Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Wrench className="w-5 h-5" />
                <span className="font-medium">Detalhes do Problema</span>
              </div>
              <div className="pl-7">
                <p className="text-base">
                  <span className="text-gray-600">Problema reportado:</span>{" "}
                  <strong>{lastEntryData.problem_reported}</strong>
                </p>
              </div>

              {lastEntryData.parts && lastEntryData.parts.length > 0 && (
                <div className="ml-5 p-2 border border-gray-300 rounded-lg">
                  <span className="text-gray-600 font-medium">Peças:</span>
                  <div className="mt-2 space-y-3">
                    {lastEntryData.parts.map((part, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Peça:</span>{" "}
                            <strong>{part.name}</strong>
                          </div>
                          <div>
                            <span className="text-gray-600">Quantidade:</span>{" "}
                            <strong>{part.quantity}</strong>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              Valor unitário:
                            </span>{" "}
                            <strong>{formatCurrency(part.unit_value)}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-2 text-right font-medium">
                      Valor total:{" "}
                      {formatCurrency(calculateTotal(lastEntryData.parts))}
                    </div>
                  </div>
                </div>
              )}

              {lastEntryData.parts && lastEntryData.parts.length == 0 && (
                <div className="space-y-2 pl-7">
                  <p className="text-base text-gray-600">
                    Não há peças nessa entrada...
                  </p>
                </div>
              )}
            </div>

            {/* Location and Author Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-5 h-5" />
                <span className="font-medium">Localização e Responsável</span>
              </div>
              <div className="pl-7 space-y-2">
                <p className="text-base flex items-center gap-2">
                  <span className="text-gray-600">Oficina:</span>{" "}
                  <strong>{lastEntryData.workshop!.name}</strong>
                </p>

                <p className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Solicitante:</span>{" "}
                  <strong>{lastEntryData.author!.name}</strong>
                </p>

                <p className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">
                    Equipe responsável:
                  </span>{" "}
                  <strong>
                    {lastEntryData.responsible_team!.name} -{" "}
                    {lastEntryData.responsible_team!.type}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
