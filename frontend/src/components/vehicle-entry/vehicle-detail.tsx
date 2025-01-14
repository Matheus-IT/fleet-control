import React, { useState } from "react";
import {
  approveEntryRequest,
  doNotApproveEntryRequest,
  getLastEntryRecordFromVehicle,
} from "@/api/request-queries";
import { Vehicle, VehicleEntryStatus, VehiclePart } from "@/types/api";
import {
  Button,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
} from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDate, formatTime } from "../../utils/date-time";
import { useRouter } from "next/navigation";
import { Clock, Car, Wrench, AlertTriangle } from "lucide-react";

export default function VehicleDetail({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [observation, setObservation] = useState("");

  const { data: lastEntryData, isPending } = useQuery({
    queryFn: () => {
      try {
        return getLastEntryRecordFromVehicle(vehicle);
      } catch (e) {
        console.log("e", e);
      }
    },
    queryKey: ["getLastEntryRecordFromVehicle"],
  });

  const mutation = useMutation({
    mutationFn: () => approveEntryRequest(lastEntryData!.id),
    onSettled: () => {
      window.location.reload();
    },
  });

  const doNotApproveMutation = useMutation({
    mutationFn: () => doNotApproveEntryRequest(lastEntryData!.id, observation),
    onSettled: () => {
      setIsModalOpen(false);
      setObservation("");
      window.location.reload();
    },
  });

  function handleGoToHistory() {
    router.push(`/vehicle-history/${vehicle.slug}`);
  }

  function handleApprove() {
    mutation.mutate();
  }

  function handleDoNotApprove() {
    const thereIsObservation = observation.trim();
    if (thereIsObservation) {
      doNotApproveMutation.mutate();
    }
  }

  const calculateTotal = (parts: VehiclePart[]) => {
    return parts.reduce(
      (sum, part) => sum + part.unit_value * part.quantity,
      0
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isPending) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!lastEntryData) {
    return null;
  }

  return (
    <main className="container mx-auto py-6 px-4 max-w-3xl">
      <Card className="w-full">
        <CardHeader className="flex gap-3">
          <Car className="w-6 h-6" />
          <div className="flex flex-col">
            <p className="text-xl font-bold">{vehicle.model}</p>
            <p className="text-small text-default-500">
              Placa: {vehicle.licence_plate}
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              <span className="text-base">
                Na oficina:{" "}
                <strong
                  className={
                    vehicle.is_at_workshop
                      ? "text-green-700 bg-green-100 px-2 py-1 rounded"
                      : "text-red-600 bg-red-100 px-2 py-1 rounded"
                  }
                >
                  {vehicle.is_at_workshop ? "Sim" : "Não"}
                </strong>
              </span>
            </div>

            {vehicle.is_at_workshop && (
              <div className="space-y-2 pl-7">
                <p className="text-base">
                  <span className="text-gray-600">Problema reportado:</span>{" "}
                  <strong>{lastEntryData.problem_reported}</strong>
                </p>
                {lastEntryData.workshop && (
                  <p className="text-base">
                    <span className="text-gray-600">Oficina:</span>{" "}
                    <strong>{lastEntryData.workshop.name}</strong>
                  </p>
                )}
              </div>
            )}

            {lastEntryData.parts && lastEntryData.parts.length > 0 && (
              <div className="mt-4">
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
                          <span className="text-gray-600">Valor unitário:</span>{" "}
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
                <p className="text-base">
                  <div className="text-gray-600">
                    Não há peças nessa entrada...
                  </div>
                </p>
              </div>
            )}

            {lastEntryData.status == VehicleEntryStatus.NOT_APPROVED && (
              <>
                <div className="space-y-2 pl-7">
                  <p className="text-base">
                    <span className="text-danger-600">Não aprovado</span>
                  </p>
                  <p className="text-base">
                    <span className="text-gray-600">Motivo: </span>
                    <strong>{lastEntryData.observation}</strong>
                  </p>
                </div>
              </>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {lastEntryData.author ? (
                <p>
                  Ultima atualização em{" "}
                  <strong>{formatDate(lastEntryData.created_at)}</strong> às{" "}
                  {formatTime(lastEntryData.created_at)} por{" "}
                  <strong>{lastEntryData.author.name}</strong>
                </p>
              ) : (
                <p>
                  Registro do veículo criado em{" "}
                  <strong>{formatDate(lastEntryData.created_at)}</strong> às{" "}
                  {formatTime(lastEntryData.created_at)}
                </p>
              )}
            </div>
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-between">
          <Button color="primary" onClick={handleGoToHistory}>
            Ver histórico
          </Button>

          {!vehicle.can_enter_workshop && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <Button
                color="success"
                onClick={handleApprove}
                isDisabled={
                  lastEntryData.status == VehicleEntryStatus.NOT_APPROVED
                }
              >
                Aprovar
              </Button>
              <Button
                color="danger"
                onClick={() => setIsModalOpen(true)}
                isDisabled={
                  lastEntryData.status == VehicleEntryStatus.NOT_APPROVED
                }
              >
                Não aprovar
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Não aprovar entrada</ModalHeader>
          <ModalBody>
            <Textarea
              label="Observação"
              placeholder="Digite o motivo da não aprovação"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              minRows={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="default" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              color="danger"
              onClick={handleDoNotApprove}
              onPress={handleDoNotApprove}
              isDisabled={!observation.trim()}
            >
              Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  );
}
